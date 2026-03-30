import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1711700000000 implements MigrationInterface {
  name = 'InitialSchema1711700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create user table
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "resetToken" character varying,
        "resetTokenExpiry" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "PK_user" PRIMARY KEY ("id")
      )
    `);

    // Create category table
    await queryRunner.query(`
      CREATE TABLE "category" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "userId" integer NOT NULL,
        CONSTRAINT "PK_category" PRIMARY KEY ("id"),
        CONSTRAINT "FK_category_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // Create note table
    await queryRunner.query(`
      CREATE TABLE "note" (
        "id" SERIAL NOT NULL,
        "title" character varying NOT NULL,
        "content" text NOT NULL,
        "isArchived" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" integer NOT NULL,
        CONSTRAINT "UQ_note_title_userId" UNIQUE ("title", "userId"),
        CONSTRAINT "PK_note" PRIMARY KEY ("id"),
        CONSTRAINT "FK_note_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // Create note_categories junction table
    await queryRunner.query(`
      CREATE TABLE "note_categories_category" (
        "noteId" integer NOT NULL,
        "categoryId" integer NOT NULL,
        CONSTRAINT "PK_note_categories" PRIMARY KEY ("noteId", "categoryId"),
        CONSTRAINT "FK_note_categories_note" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_note_categories_category" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    // Create indexes for junction table
    await queryRunner.query(`CREATE INDEX "IDX_note_categories_noteId" ON "note_categories_category" ("noteId")`);
    await queryRunner.query(`CREATE INDEX "IDX_note_categories_categoryId" ON "note_categories_category" ("categoryId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_note_categories_categoryId"`);
    await queryRunner.query(`DROP INDEX "IDX_note_categories_noteId"`);
    await queryRunner.query(`DROP TABLE "note_categories_category"`);
    await queryRunner.query(`DROP TABLE "note"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
