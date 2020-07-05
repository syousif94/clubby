SHELL=/bin/bash

%:      # thanks to chakrit
  @:    # thanks to William Pursell

dev:
	systemfd --no-pid -- cargo watch --ignore 'db/*' --ignore 'redis/*' -x run

db:
	chmod a+x scripts/docker.sh
	./scripts/docker.sh
	docker-compose -f dev.yml up

compose:
	chmod a+x scripts/docker.sh
	./scripts/docker.sh
	docker-compose -f dev.yml build

diesel:
	chmod a+x scripts/docker.sh
	./scripts/docker.sh
	diesel setup

migration:
	@diesel migration generate $(filter-out $@,$(MAKECMDGOALS))

migrate:
	chmod a+x scripts/docker.sh
	./scripts/docker.sh
	diesel migration run

.PHONY: dev db compose diesel migrate migration