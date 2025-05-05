.PHONY: run test lint clean freeze install

dev:
	FLASK_APP=app.py FLASK_ENV=development flask run --debug --host=0.0.0.0 --port=8080

run:
	FLASK_APP=app.py flask run --host=0.0.0.0 --port=8080