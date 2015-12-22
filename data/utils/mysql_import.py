import argparse
import xml.etree.ElementTree as ET
import mysql.connector
import glob
import json
import yaml
import requests
import sys

def importSubjects(cnx, filepath):
    print 'importing subjects', filepath
    tree = ET.parse(filepath)
    root = tree.getroot()
    add_subject = "INSERT INTO subjects " \
        "(subject_top_term, subject) " \
        "VALUES (%s, %s)"
    add_subject_top_term = "INSERT INTO subjects " \
        "(subject_top_term) " \
        "VALUES (%s)"
    cursor = cnx.cursor()

    for top_term_node in root:
        top_term = top_term_node.attrib['value']
        cursor.execute(add_subject_top_term, (top_term,))
        for term_node in top_term_node:
            term = term_node.attrib['value']
            cursor.execute(add_subject, (top_term, term))
    cnx.commit()
    cursor.close()

def importSessions(cnx, filepath):
    print 'importing sessions', filepath
    add_session = "INSERT INTO congresses (`congress_id`, `start`, `end`) " \
        "VALUES (%s, %s, %s)"
    cursor = cnx.cursor()

    with open(filepath, 'r') as f:
        congress = -1
        start = -1
        end = -1
        for line in f:
            line = line.split('\t')
            try:
                int(line[0])
            except ValueError:
                continue
            if congress != int(line[0]):
                if congress != -1:
                    cursor.execute(add_session, (congress, start, end))
                congress = int(line[0])
                start = line[2]
            end = line[3]
        cursor.execute(add_session, (congress, start, end))
    cnx.commit()
    cursor.close()

def importMembers(cnx, filepath):
    print 'importing members', filepath
    # TODO change to use a proxy dict like in importBills
    add_member = "INSERT INTO members " \
        "(bioguide_id, govtrack_id, thomas_id, lis_id, first_name, last_name, gender, birthday) " \
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    add_term = "INSERT INTO terms " \
        "(member_bioguide_id, state, district, start, end, party, type) " \
        "VALUES (%s, %s, %s, %s, %s, %s, %s)"
    get_member = "SELECT bioguide_id FROM members WHERE bioguide_id = %s LIMIT 1"
    cursor = cnx.cursor()

    with open(filepath, 'r') as f:
        data = yaml.load(f)
        for person in data:
            bioguide_id = person['id']['bioguide']
            # TODO make this allow updates
            cursor.execute(get_member, (bioguide_id,))
            if cursor.fetchone() is not None:
                continue
            govtrack_id = person['id']['govtrack']
            thomas_id = person['id']['thomas'] if 'thomas' in person['id'] else None
            lis_id = person['id']['lis'] if 'lis' in person['id'] else None
            first_name = person['name']['first']
            last_name = person['name']['last']
            gender = person['bio']['gender']
            birthday = person['bio']['birthday'] if 'birthday' in person['bio'] else None
            # print 'importing', first_name, last_name
            cursor.execute(add_member, (bioguide_id, govtrack_id, thomas_id, lis_id, first_name, last_name, gender, birthday))
            for term in person['terms']:
                district = term['district'] if 'district' in term else None
                party = term['party'] if 'party' in term else None
                cursor.execute(add_term, (bioguide_id, term['state'], district, term['start'], term['end'], party, term['type']))


    cnx.commit()
    cursor.close()

def importBills(cnx, filepath, elasticsearch_url=None):
    print 'import bills', filepath
    num_bills_processed = 0

    add_bill = "INSERT INTO bills " \
        "(bill_id, bill_type, congress, number, official_title, popular_title, short_title, introduced_at, active, vetoed, enacted, awaiting_signature, status, status_at, sponsor_thomas_id, subject_top_term_id) " \
        "VALUES (%(bill_id)s, %(bill_type)s, %(congress)s, %(number)s, %(official_title)s, %(popular_title)s, %(short_title)s, %(introduced_at)s, %(active)s, %(vetoed)s, %(enacted)s, %(awaiting_signature)s, %(status)s, %(status_at)s, %(sponsor_thomas_id)s, %(subject_top_term_id)s)"
    add_sponsor = "INSERT INTO bill_sponsors " \
        "(member_thomas_id, bill_id, sponsored_at, withdrawn_at, primary_sponsor) " \
        "VALUES (%s, %s, %s, %s, %s)"
    add_subject = "INSERT INTO bill_subjects (subject_id, bill_id) VALUES (%s, %s)"
    get_subject_top_term_id = "SELECT subject_id FROM subjects WHERE subject_top_term = %s AND subject is NULL LIMIT 1"
    get_subject_id = "SELECT subject_id FROM subjects where subject = %s LIMIT 1"

    cursor = cnx.cursor()
    copy_fields = ['bill_id', 'bill_type', 'congress', 'number', 'official_title', 'popular_title', 'short_title', 'introduced_at', 'active', 'vetoed', 'enacted', 'awaiting_signature', 'status', 'status_at', 'sponsor_thomas_id', 'subject_top_term_id']

    for path in glob.iglob(filepath + "data.json"):
        with open(path, 'r') as bill_file:
            bill = json.loads(bill_file.read())
            bill_id = bill['bill_id']
            for key in bill['history']:
                bill[key] = 1 if bill['history'][key] else 0
            bill['sponsor_thomas_id'] = bill['sponsor']['thomas_id']
            cursor.execute(get_subject_top_term_id, (bill['subjects_top_term'],))
            subject_top_term_id = cursor.fetchone()
            bill['subject_top_term_id'] = subject_top_term_id[0] if subject_top_term_id is not None else None
            # not sure why this proxy object has to exist but otherwise there is this error:
            # File "/Library/Python/2.7/site-packages/mysql/connector/cursor.py", line 361, in _process_params_dict
            #     "Failed processing pyformat-parameters; %s" % err)
            # mysql.connector.errors.ProgrammingError: Failed processing pyformat-parameters; Python 'list' cannot be converted to a MySQL type
            proxy = {}
            for field in copy_fields:
                if bill[field] is not None:
                    proxy[field] = str(bill[field])
                else:
                    proxy[field] = None
            proxy['introduced_at'] = proxy['introduced_at'][:10]
            proxy['status_at'] = proxy['status_at'][:10]
            # print add_bill%(proxy)
            cursor.execute(add_bill, proxy)
            spon = bill['sponsor']
            cursor.execute(add_sponsor, (spon['thomas_id'], bill_id, bill['introduced_at'], None, 1))
            for cos in bill['cosponsors']:
                cursor.execute(add_sponsor, (cos['thomas_id'], bill_id, cos['sponsored_at'], cos['withdrawn_at'], 0))
            for subject in bill['subjects']:
                cursor.execute(get_subject_id, (subject,))
                subject_id = cursor.fetchone()
                if subject_id is not None:
                    cursor.execute(add_subject, (subject_id[0], bill_id))
            if elasticsearch_url is not None:
                importBillText(cnx, elasticsearch_url, path[:-len('data.json')] + 'text-versions/*/', proxy)
            num_bills_processed += 1
            if num_bills_processed % 100 == 0:
                print 'finished', num_bills_processed, 'bills'

    print 'done. processed', num_bills_processed, 'bills'
    cnx.commit()
    cursor.close()

def importBillText(cnx, url, filepath, bill_info):
    addBillVersion = "INSERT INTO bill_versions " \
        "(bill_version_id, issued_on, version_code, bill_id) " \
        "VALUES (%(version_id)s, %(issued_on)s, %(version_code)s, %(bill_id)s)"
    cursor = cnx.cursor()
    for path in glob.iglob(filepath):
        with open(path + 'data.json', 'r') as text_info_file:
            text_info = json.loads(text_info_file.read())
            proxy = {
                'version_id':       text_info['bill_version_id'],
                'issued_on':        text_info['issued_on'],
                'version_code':     text_info['version_code'],
                'bill_id':          bill_info['bill_id'],
                'official_title':   bill_info['official_title'],
                'short_title':      bill_info['short_title'],
                'popular_title':    bill_info['popular_title']
            }
            # print addBillVersion%(proxy)
            # print 'add to elasticsearch', path + 'document.txt'
            cursor.execute(addBillVersion, proxy)
            with open(path + 'document.txt', 'r') as bill_text_file:
                proxy['bill_text'] = bill_text_file.read()
            r = requests.put(url + 'bill_text/' + proxy['version_id'], json.dumps(proxy))
            # TODO detect and handle errors
    cnx.commit()
    cursor.close()

def importVotes(cnx, filepath):
    print 'import votes', filepath
    num_votes_processed = 0

    add_vote = "INSERT INTO votes " \
        "(vote_id, bill_id, date, category, result, question, subject) " \
        "VALUES (%(vote_id)s, %(bill_id)s, %(date)s, %(category)s, %(result)s, %(question)s, %(subject)s)"
    add_member_vote = "INSERT INTO member_votes " \
        "(member_bioguide_id, vote_id, vote, party, state, display_as) " \
        "VALUES (%(member_bioguide_id)s, %(vote_id)s, %(vote)s, %(party)s, %(state)s, %(display_as)s)"
    get_member_bioguide_id_by_lis_id = "SELECT bioguide_id FROM members WHERE lis_id = %s"
    cursor = cnx.cursor()

    for path in glob.iglob(filepath):
        with open(path, 'r') as vote_file:
            vote = json.loads(vote_file.read())
            if 'bill' not in vote:
                continue
            proxy = {
                'vote_id': vote['vote_id'],
                'bill_id': '%(type)s%(number)s-%(congress)s'%(vote['bill']),
                'date': vote['date'][:10],
                'category': vote['category'],
                'result': vote['result'],
                'question': vote['question'],
                'subject': vote['subject'] if 'subject' in vote else None
            }
            cursor.execute(add_vote, proxy)

            chamber = vote['chamber']
            for display_as in vote['votes']:
                vote_enum = '0'
                if display_as == 'Aye' or display_as == 'Yea':
                    vote_enum = '+'
                elif display_as == 'Nay' or display_as == 'No':
                    vote_enum = '-'
                for member_vote in vote['votes'][display_as]:
                    member_id = member_vote['id']
                    if chamber == 's':
                        cursor.execute(get_member_bioguide_id_by_lis_id, (member_id,))
                        member_id = cursor.fetchone()[0]
                    member_vote_proxy = {
                        'member_bioguide_id': member_id,
                        'vote_id': vote['vote_id'],
                        'vote': vote_enum,
                        'party': member_vote['party'],
                        'state': member_vote['state'],
                        'display_as': display_as
                    }
                    cursor.execute(add_member_vote, member_vote_proxy)
            num_votes_processed += 1
            if num_votes_processed % 100 == 0:
                print 'finished', num_votes_processed, 'votes'
    print 'done. processed', num_votes_processed, 'votes'
    cnx.commit()
    cursor.close()

def main(argv):
    parser = argparse.ArgumentParser(description='bulk import data from GovTrack.us to MySQL schema')
    parser.add_argument('-u', '--user', help='username', required=True)
    parser.add_argument('-p', '--password', help='password', required=True)
    parser.add_argument('-db', '--database', help='name of MySQL schema', required=True)
    parser.add_argument('--path', help='path to root folder of GovTrack data', default='../data')
    parser.add_argument('-c', '--congress', help='congress number', default='113')
    parser.add_argument('-H', '--host', help='database host', default='localhost')
    parser.add_argument('-e', '--elasticsearch_host', default='http://localhost:9200/')
    args = vars(parser.parse_args(argv))
    cnx = mysql.connector.connect(user=args['user'],password=args['password'],database=args['database'])
    if args['path'][-1] == '/':
        args['path'] = args['path'][:-1]
    args['elasticsearch_host'] += args['database'] + '/'
    importSubjects(cnx, args['path']+'/subjects/liv111.xml')
    importSubjects(cnx, args['path']+'/subjects/crsnet.xml')
    importSessions(cnx, args['path']+'/sessions.tsv')
    importMembers(cnx, args['path']+'/membership/legislators-current.yaml')
    importMembers(cnx, args['path']+'/membership/legislators-historical.yaml')
    importBills(cnx, args['path']+'/113/bills/hconres/*/', elasticsearch_url=args['elasticsearch_host'])
    importBills(cnx, args['path']+'/113/bills/hjres/*/', elasticsearch_url=args['elasticsearch_host'])
    importBills(cnx, args['path']+'/113/bills/hres/*/', elasticsearch_url=args['elasticsearch_host'])
    importBills(cnx, args['path']+'/113/bills/hr/*/', elasticsearch_url=args['elasticsearch_host'])
    importBills(cnx, args['path']+'/113/bills/s/*/', elasticsearch_url=args['elasticsearch_host'])
    importBills(cnx, args['path']+'/113/bills/sconres/*/', elasticsearch_url=args['elasticsearch_host'])
    importBills(cnx, args['path']+'/113/bills/sjres/*/', elasticsearch_url=args['elasticsearch_host'])
    importBills(cnx, args['path']+'/113/bills/sres/*/', elasticsearch_url=args['elasticsearch_host'])
    importVotes(cnx, args['path']+'/113/votes/2013/*/data.json')
    importVotes(cnx, args['path']+'/113/votes/2014/*/data.json')
    print 'all data imports done'
    cnx.commit()
    cnx.close()

if __name__ == "__main__":
    main(sys.argv[1:])
