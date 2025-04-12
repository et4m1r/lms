import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_progress_lesson_progress_status" AS ENUM('not_started', 'in_progress', 'completed');
  CREATE TABLE IF NOT EXISTS "progress_lesson_progress" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lesson_id" integer NOT NULL,
  	"status" "enum_progress_lesson_progress_status" NOT NULL,
  	"last_accessed" timestamp(3) with time zone,
  	"completed_at" timestamp(3) with time zone,
  	"time_spent" numeric,
  	"notes" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "progress_quiz_attempts_answers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question_index" numeric NOT NULL,
  	"answer" varchar NOT NULL,
  	"correct" boolean DEFAULT false NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "tests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "enrollments" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "enrollments" CASCADE;
  ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_user_id_students_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_enrollments_fk";
  
  DROP INDEX IF EXISTS "subscriptions_user_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_enrollments_id_idx";
  ALTER TABLE "progress" ALTER COLUMN "student_id" DROP NOT NULL;
  ALTER TABLE "subscriptions" ALTER COLUMN "end_date" DROP NOT NULL;
  ALTER TABLE "lessons" ADD COLUMN "module_id" integer;
  ALTER TABLE "_lessons_v" ADD COLUMN "version_module_id" integer;
  ALTER TABLE "subscriptions" ADD COLUMN "stripe_subscription_id" varchar;
  ALTER TABLE "subscriptions" ADD COLUMN "student_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tests_id" integer;
  DO $$ BEGIN
   ALTER TABLE "progress_lesson_progress" ADD CONSTRAINT "progress_lesson_progress_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "progress_lesson_progress" ADD CONSTRAINT "progress_lesson_progress_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."progress"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "progress_quiz_attempts_answers" ADD CONSTRAINT "progress_quiz_attempts_answers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."progress_quiz_attempts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "progress_lesson_progress_order_idx" ON "progress_lesson_progress" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "progress_lesson_progress_parent_id_idx" ON "progress_lesson_progress" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "progress_lesson_progress_lesson_idx" ON "progress_lesson_progress" USING btree ("lesson_id");
  CREATE INDEX IF NOT EXISTS "progress_quiz_attempts_answers_order_idx" ON "progress_quiz_attempts_answers" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "progress_quiz_attempts_answers_parent_id_idx" ON "progress_quiz_attempts_answers" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "tests_updated_at_idx" ON "tests" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "tests_created_at_idx" ON "tests" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "lessons" ADD CONSTRAINT "lessons_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_lessons_v" ADD CONSTRAINT "_lessons_v_version_module_id_modules_id_fk" FOREIGN KEY ("version_module_id") REFERENCES "public"."modules"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tests_fk" FOREIGN KEY ("tests_id") REFERENCES "public"."tests"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "lessons_module_idx" ON "lessons" USING btree ("module_id");
  CREATE INDEX IF NOT EXISTS "_lessons_v_version_version_module_idx" ON "_lessons_v" USING btree ("version_module_id");
  CREATE INDEX IF NOT EXISTS "subscriptions_student_idx" ON "subscriptions" USING btree ("student_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_tests_id_idx" ON "payload_locked_documents_rels" USING btree ("tests_id");
  ALTER TABLE "subscriptions" DROP COLUMN IF EXISTS "user_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "enrollments_id";
  DROP TYPE "public"."enum_enrollments_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_enrollments_status" AS ENUM('active', 'completed', 'dropped', 'pending');
  CREATE TABLE IF NOT EXISTS "enrollments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"student_id" integer NOT NULL,
  	"course_id" integer NOT NULL,
  	"status" "enum_enrollments_status" DEFAULT 'active' NOT NULL,
  	"enrolled_at" timestamp(3) with time zone NOT NULL,
  	"started_at" timestamp(3) with time zone,
  	"completed_at" timestamp(3) with time zone,
  	"dropped_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "progress_lesson_progress" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "progress_quiz_attempts_answers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tests" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "progress_lesson_progress" CASCADE;
  DROP TABLE "progress_quiz_attempts_answers" CASCADE;
  DROP TABLE "tests" CASCADE;
  ALTER TABLE "lessons" DROP CONSTRAINT "lessons_module_id_modules_id_fk";
  
  ALTER TABLE "_lessons_v" DROP CONSTRAINT "_lessons_v_version_module_id_modules_id_fk";
  
  ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_student_id_students_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tests_fk";
  
  DROP INDEX IF EXISTS "lessons_module_idx";
  DROP INDEX IF EXISTS "_lessons_v_version_version_module_idx";
  DROP INDEX IF EXISTS "subscriptions_student_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_tests_id_idx";
  ALTER TABLE "progress" ALTER COLUMN "student_id" SET NOT NULL;
  ALTER TABLE "subscriptions" ALTER COLUMN "end_date" SET NOT NULL;
  ALTER TABLE "subscriptions" ADD COLUMN "user_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "enrollments_id" integer;
  DO $$ BEGIN
   ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "enrollments_student_idx" ON "enrollments" USING btree ("student_id");
  CREATE INDEX IF NOT EXISTS "enrollments_course_idx" ON "enrollments" USING btree ("course_id");
  CREATE INDEX IF NOT EXISTS "enrollments_updated_at_idx" ON "enrollments" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "enrollments_created_at_idx" ON "enrollments" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_students_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enrollments_fk" FOREIGN KEY ("enrollments_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "subscriptions_user_idx" ON "subscriptions" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_enrollments_id_idx" ON "payload_locked_documents_rels" USING btree ("enrollments_id");
  ALTER TABLE "lessons" DROP COLUMN IF EXISTS "module_id";
  ALTER TABLE "_lessons_v" DROP COLUMN IF EXISTS "version_module_id";
  ALTER TABLE "subscriptions" DROP COLUMN IF EXISTS "stripe_subscription_id";
  ALTER TABLE "subscriptions" DROP COLUMN IF EXISTS "student_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "tests_id";
  DROP TYPE "public"."enum_progress_lesson_progress_status";`)
}
