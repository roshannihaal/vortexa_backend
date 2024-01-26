dev:
	docker compose up -d

dev-rebuild:
	docker compose up -d --build

down:
	docker compose down

down-v:
	docker compose down -v

down-vr:
	docker compose down -v --remove-orphans