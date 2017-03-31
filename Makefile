default: publish_sim
prod: publish_master

publish_%: venv
	venv/bin/python publish.py $*

venv: venv/bin/activate
venv/bin/activate: requirements.txt
	test -d venv || virtualenv venv
	venv/bin/pip install -Ur requirements.txt
	touch venv/bin/activate

