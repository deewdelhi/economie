# economie

to install the requirements.txt run: pip install -r requirements.txt

do not forget to run py manage.py migrate and to commit the migrations at all times.

Populare DB:
python scripts/seed_data.py

Verificare date:
sqlite3 db.sqlite3

.tables

SELECT username, email FROM user_user;

select * from skill_skill;