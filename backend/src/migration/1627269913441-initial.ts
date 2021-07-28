import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1627269913441 implements MigrationInterface {
    name = 'initial1627269913441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "list_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "quantity" integer NOT NULL, "price" numeric NOT NULL, "brand" character varying, "market" character varying, "purchased" boolean NOT NULL DEFAULT false, "productId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "shoppingListId" uuid, CONSTRAINT "PK_33d13041eff3d3e0f7cd4c5cae0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shopping_list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "done" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_87d9431f2ea573a79370742b474" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" numeric NOT NULL, "brand" character varying, "market" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shopping_list_shared_users_user" ("shoppingListId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_a6678a78d429899af471109b729" PRIMARY KEY ("shoppingListId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_be0aef2323caa0012ae374631e" ON "shopping_list_shared_users_user" ("shoppingListId") `);
        await queryRunner.query(`CREATE INDEX "IDX_285134c4294c7e4aa78f0b9abb" ON "shopping_list_shared_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "shopping_list" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "shopping_list" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "list_product" ADD CONSTRAINT "FK_2ea7a3c845d15c4ca9e85698d34" FOREIGN KEY ("shoppingListId") REFERENCES "shopping_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shopping_list" ADD CONSTRAINT "FK_38e60f213f35fb8fe51d3bf41e4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shopping_list_shared_users_user" ADD CONSTRAINT "FK_be0aef2323caa0012ae374631e2" FOREIGN KEY ("shoppingListId") REFERENCES "shopping_list"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "shopping_list_shared_users_user" ADD CONSTRAINT "FK_285134c4294c7e4aa78f0b9abbf" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shopping_list_shared_users_user" DROP CONSTRAINT "FK_285134c4294c7e4aa78f0b9abbf"`);
        await queryRunner.query(`ALTER TABLE "shopping_list_shared_users_user" DROP CONSTRAINT "FK_be0aef2323caa0012ae374631e2"`);
        await queryRunner.query(`ALTER TABLE "shopping_list" DROP CONSTRAINT "FK_38e60f213f35fb8fe51d3bf41e4"`);
        await queryRunner.query(`ALTER TABLE "list_product" DROP CONSTRAINT "FK_2ea7a3c845d15c4ca9e85698d34"`);
        await queryRunner.query(`ALTER TABLE "shopping_list" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shopping_list" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`DROP INDEX "IDX_285134c4294c7e4aa78f0b9abb"`);
        await queryRunner.query(`DROP INDEX "IDX_be0aef2323caa0012ae374631e"`);
        await queryRunner.query(`DROP TABLE "shopping_list_shared_users_user"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "shopping_list"`);
        await queryRunner.query(`DROP TABLE "list_product"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
