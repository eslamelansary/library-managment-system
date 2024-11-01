import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1730430785696 implements MigrationInterface {
    name = 'Init1730430785696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`permissions\` json NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`books\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL DEFAULT '0', \`title\` varchar(255) NOT NULL, \`author\` varchar(255) NOT NULL, \`publisher\` varchar(255) NOT NULL, \`publication_date\` date NOT NULL, \`format\` enum ('paperback', 'hardcover', 'ebook') NOT NULL DEFAULT 'paperback', \`isbn\` varchar(13) NULL, \`description\` text NULL, \`shelf_location\` varchar(5) NULL, \`language\` varchar(50) NOT NULL, \`pages\` int NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, INDEX \`IDX_SHELF\` (\`shelf_location\`), UNIQUE INDEX \`IDX_ISBN\` (\`isbn\`), FULLTEXT INDEX \`IDX_AUTHOR_TITLE\` (\`author\`, \`title\`), FULLTEXT INDEX \`IDX_AUTHOR\` (\`author\`), FULLTEXT INDEX \`IDX_TITLE\` (\`title\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role_id\` int UNSIGNED NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_USER_EMAIL\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`borrowed_books\` (\`book_id\` int UNSIGNED NOT NULL, \`user_id\` int UNSIGNED NOT NULL, \`borrowed_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`returned_at\` timestamp NULL, \`due_date\` timestamp NOT NULL, \`is_overdue\` tinyint NULL DEFAULT 0, \`status\` enum ('borrowed', 'returned', 'overdue') NOT NULL DEFAULT 'borrowed', \`notes\` text NULL, INDEX \`IDX_STATUS\` (\`status\`), PRIMARY KEY (\`book_id\`, \`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_a2cecd1a3531c0b041e29ba46e1\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`borrowed_books\` ADD CONSTRAINT \`FK_bde7932cbe9a7c99c64526f3a50\` FOREIGN KEY (\`book_id\`) REFERENCES \`books\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`borrowed_books\` ADD CONSTRAINT \`FK_4954ce93390b23aca82aadad003\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`borrowed_books\` DROP FOREIGN KEY \`FK_4954ce93390b23aca82aadad003\``);
        await queryRunner.query(`ALTER TABLE \`borrowed_books\` DROP FOREIGN KEY \`FK_bde7932cbe9a7c99c64526f3a50\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_a2cecd1a3531c0b041e29ba46e1\``);
        await queryRunner.query(`DROP INDEX \`IDX_STATUS\` ON \`borrowed_books\``);
        await queryRunner.query(`DROP TABLE \`borrowed_books\``);
        await queryRunner.query(`DROP INDEX \`IDX_USER_EMAIL\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_TITLE\` ON \`books\``);
        await queryRunner.query(`DROP INDEX \`IDX_AUTHOR\` ON \`books\``);
        await queryRunner.query(`DROP INDEX \`IDX_AUTHOR_TITLE\` ON \`books\``);
        await queryRunner.query(`DROP INDEX \`IDX_ISBN\` ON \`books\``);
        await queryRunner.query(`DROP INDEX \`IDX_SHELF\` ON \`books\``);
        await queryRunner.query(`DROP TABLE \`books\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
