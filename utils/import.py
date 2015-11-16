import argparse
import glob
import json
import requests
import sys
import yaml

def send_bills(path_to_bills, root_url, doc_type = "bill"):
    bills_processed = 0
    for path in glob.iglob(path_to_bills):
        with open(path, 'r') as bill:
            bill_string = bill.read()
            bill_data = json.loads(bill_string)
            bill_data['doc_type'] = doc_type
            bill_id = bill_data['bill_id']
            r = requests.put(root_url + bill_id, json.dumps(bill_data))
            if 'ok' not in r.json():
                print r.json()
        bills_processed += 1

        if bills_processed % 100 == 0:
            print 'processed', str(bills_processed)
    print 'finished all (' + str(bills_processed) + ') bills'

def send_members(path_to_members, root_url, doc_type = "member"):
    members_file = open(path_to_members, 'r')
    data = yaml.load(members_file)
    members_processed = 0
    for person in data:
        thomas_id = person['id']['thomas']
        person['doc_type'] = doc_type
        r = requests.put(root_url + thomas_id, json.dumps(person))
        if 'ok' not in r.json():
            print r.json()
        members_processed += 1

        if members_processed % 50 == 0:
            print 'processed', str(members_processed)
    print 'finished all (' + str(members_processed) + ') members'

def send_votes(path_to_votes, root_url, doc_type = "vote"):
    votes_processed = 0
    for path in glob.iglob(path_to_votes):
        with open(path, 'r') as vote:
            vote_data = json.loads(vote.read())
            vote_data['doc_type'] = doc_type
            vote_id = vote_data['vote_id']
            r = requests.put(root_url + vote_id, json.dumps(vote_data))
            if 'ok' not in r.json():
                print r.json()
        votes_processed += 1

        if votes_processed % 100 == 0:
            print "processed", str(votes_processed)
    print "finished all (" + str(votes_processed) + ") votes"

def main(argv):
    parser = argparse.ArgumentParser(description='bulk import data from GovTrack.us to CouchDB')
    parser.add_argument('-d', '--db', help='name of the CouchDB database', required=True)
    parser.add_argument('-u', '--url', nargs='?', help='root url of the database, default: http://127.0.0.1:5984/', default='http://127.0.0.1:5984/')
    parser.add_argument('-p', '--path', nargs='?', help='path to congress root folder, default: current directory', default='.')
    args = vars(parser.parse_args(argv))
    if args['url'][:7] != 'http://':
        args['url'] = 'http://' + args['url']
    if args['url'][-1] != '/':
        args['url'] = args['url'] + '/'
    if args['path'][-1] != '/':
        args['path'] = args['path'] + '/'

    root_url = args['url'] + args['db'] + '/'

    ## TODO change data types to match the defaults and reload the database
    ## TODO add options to selectively import different types of data
    # print 'importing house bills...'
    # house_path = args['path'] + 'bills/hr/*/data.json'
    # send_bills(house_path, root_url)
    # print 'importing senate bills...'
    # senate_path = args['path'] + 'bills/s/*/data.json'
    # send_bills(senate_path, root_url)
    print 'importing legislators...'
    members_path = args['path'] + 'membership/legislators-current.yaml'
    send_members(members_path, root_url)
    print 'importing votes...'
    votes_path = args['path'] + 'votes/*/*/data.json'
    send_votes(votes_path, root_url)

if __name__ == '__main__':
    main(sys.argv[1:])
