-- CreateEnum
CREATE TYPE "FLAMES" AS ENUM ('FRIEND', 'LOVER', 'AFFECTION', 'MARRIAGE', 'ENEMY', 'SIBLING');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" BYTEA,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flames_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "target" TEXT NOT NULL,
    "result" "FLAMES" NOT NULL,

    CONSTRAINT "flames_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "game_id" TEXT NOT NULL,
    "player1_id" UUID NOT NULL,
    "player2_id" UUID NOT NULL,
    "winner_id" UUID NOT NULL,

    CONSTRAINT "games_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_name_key" ON "user"("name");

-- CreateIndex
CREATE UNIQUE INDEX "games_id_key" ON "games"("id");

-- CreateIndex
CREATE UNIQUE INDEX "games_name_key" ON "games"("name");

-- AddForeignKey
ALTER TABLE "flames_history" ADD CONSTRAINT "flames_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games_history" ADD CONSTRAINT "games_history_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games_history" ADD CONSTRAINT "games_history_player1_id_fkey" FOREIGN KEY ("player1_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games_history" ADD CONSTRAINT "games_history_player2_id_fkey" FOREIGN KEY ("player2_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games_history" ADD CONSTRAINT "games_history_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
