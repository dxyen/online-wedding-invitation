-- data.sql -- intentionally contains NO INSERT statements and NO password hash.
-- The admin account (admin@wedding.local / Admin@123) and the seed wedding
-- (Thanh Truc & Xuan Yen, slug thanh-truc-xuan-yen) are created at runtime by
-- com.wedding.config.DataSeeder (a CommandLineRunner) only when the DB is empty.
-- Seeding in code lets the password be hashed with BCrypt PasswordEncoder at
-- runtime instead of hardcoding / fabricating a hash in SQL. Do not add a
-- plaintext password or a hand-written hash here.
SELECT 1;
