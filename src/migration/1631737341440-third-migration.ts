import {MigrationInterface, QueryRunner} from "typeorm";

export class thirdMigration1631737341440 implements MigrationInterface {
    name = 'thirdMigration1631737341440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "push_notification_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_ff490b06aaeefb38fa140cf1fee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "push_notification_manager" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_d2c356cfb8325ed0bb3380b5951" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "push_notification_token" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "push_notification_token" ADD "token" character varying`);
        await queryRunner.query(`ALTER TABLE "push_notification_token" ADD CONSTRAINT "FK_6ff0b307da861bb462b7f9843ce" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "push_notification_manager" ADD CONSTRAINT "FK_4d368ae46088ae7dc82752625b3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "push_notification_manager" DROP CONSTRAINT "FK_4d368ae46088ae7dc82752625b3"`);
        await queryRunner.query(`ALTER TABLE "push_notification_token" DROP CONSTRAINT "FK_6ff0b307da861bb462b7f9843ce"`);
        await queryRunner.query(`ALTER TABLE "push_notification_token" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "push_notification_token" ADD "token" character varying`);
        await queryRunner.query(`DROP TABLE "push_notification_manager"`);
        await queryRunner.query(`DROP TABLE "push_notification_token"`);
    }

}
