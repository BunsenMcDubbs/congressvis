# Congressional Data

This dataset contains information on bills, votes and members of Congress
(primarily the 113th Congress 2013-2014). Below is a rough description of
the type and nature of the data available. It may not be complete or include
future additions but gives a good gist of what capabilities are available.

 - Members
    - Name
    - Gender
    - Birthday
    - Terms: terms served in congress
        - State
        - District
        - Party
        - Start, end date
        - Phone
        - Contact Form: url to online contact form
 - Bills
    - Short, Popular, Official titles
    - Sponsors (primary and co-sponsors): members of congress who introduced
   and sponsor the bill
    - Actions [not yet supported]: list of actions related to the bill (votes,
   moving into and out of committee, amendments, motions etc.).
      - Actor: either a committee or an individual member of congress
      - Date performed
      - other details relevant to specific actions
    - Subjects: Library of Congress assigned topics the bill covers or effects
    - Status: active, vetoed, enacted, awaiting signature, current committee
 - Votes
    - Category: type of vote (passage, quorum, recommit, amendment)
    - Result
    - Question: official language of the vote
    - Bill id
    - Date

## MySQL Schema

![mysql database diagram](https://raw.githubusercontent.com/BunsenMcDubbs/congressvis/master/data/utils/schema_diagram.png)
