import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_courses_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__courses_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_modules_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_modules_completion_criteria_type" AS ENUM('all_lessons', 'min_score', 'custom');
  CREATE TYPE "public"."enum__modules_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__modules_v_version_completion_criteria_type" AS ENUM('all_lessons', 'min_score', 'custom');
  CREATE TYPE "public"."enum_lessons_quiz_questions_type" AS ENUM('multiple', 'boolean', 'text');
  CREATE TYPE "public"."enum_lessons_assignment_allowed_file_types" AS ENUM('pdf', 'doc', 'image', 'zip', 'code');
  CREATE TYPE "public"."enum_lessons_type" AS ENUM('video', 'reading', 'quiz', 'assignment', 'discussion');
  CREATE TYPE "public"."enum_lessons_quiz_settings_show_correct_answers" AS ENUM('never', 'after_each', 'after_submit', 'after_all');
  CREATE TYPE "public"."enum_lessons_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__lessons_v_version_quiz_questions_type" AS ENUM('multiple', 'boolean', 'text');
  CREATE TYPE "public"."enum__lessons_v_version_assignment_allowed_file_types" AS ENUM('pdf', 'doc', 'image', 'zip', 'code');
  CREATE TYPE "public"."enum__lessons_v_version_type" AS ENUM('video', 'reading', 'quiz', 'assignment', 'discussion');
  CREATE TYPE "public"."enum__lessons_v_version_quiz_settings_show_correct_answers" AS ENUM('never', 'after_each', 'after_submit', 'after_all');
  CREATE TYPE "public"."enum__lessons_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_enrollments_status" AS ENUM('active', 'completed', 'dropped', 'pending');
  CREATE TYPE "public"."enum_progress_module_progress_status" AS ENUM('not_started', 'in_progress', 'completed');
  CREATE TYPE "public"."enum_progress_status" AS ENUM('not_started', 'in_progress', 'completed');
  CREATE TYPE "public"."enum_products_product_price_accepted_currency" AS ENUM('AUD', 'USD');
  CREATE TYPE "public"."enum_products_product_status" AS ENUM('active', 'inactive');
  CREATE TYPE "public"."enum_subscriptions_status" AS ENUM('active', 'inactive');
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "courses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"thumbnail_id" integer,
  	"status" "enum_courses_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_courses_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "courses_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"modules_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_courses_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_thumbnail_id" integer,
  	"version_status" "enum__courses_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__courses_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_courses_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"modules_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "modules" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"course_id" integer,
  	"order" numeric,
  	"status" "enum_modules_status" DEFAULT 'draft',
  	"completion_criteria_type" "enum_modules_completion_criteria_type" DEFAULT 'all_lessons',
  	"completion_criteria_minimum_score" numeric,
  	"completion_criteria_custom_rule" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_modules_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "modules_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"lessons_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_modules_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_description" jsonb,
  	"version_course_id" integer,
  	"version_order" numeric,
  	"version_status" "enum__modules_v_version_status" DEFAULT 'draft',
  	"version_completion_criteria_type" "enum__modules_v_version_completion_criteria_type" DEFAULT 'all_lessons',
  	"version_completion_criteria_minimum_score" numeric,
  	"version_completion_criteria_custom_rule" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__modules_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_modules_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"lessons_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "lessons_quiz_questions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"correct" boolean DEFAULT false
  );
  
  CREATE TABLE IF NOT EXISTS "lessons_quiz_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"type" "enum_lessons_quiz_questions_type",
  	"answer" varchar,
  	"points" numeric,
  	"explanation" jsonb
  );
  
  CREATE TABLE IF NOT EXISTS "lessons_assignment_rubric" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"criterion" varchar,
  	"points" numeric,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "lessons_assignment_allowed_file_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_lessons_assignment_allowed_file_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "lessons_discussion_guidelines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "lessons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"order" numeric,
  	"type" "enum_lessons_type",
  	"description" varchar,
  	"video_url" varchar,
  	"video_duration" numeric,
  	"video_transcript" varchar,
  	"content" jsonb,
  	"quiz_settings_time_limit" numeric,
  	"quiz_settings_attempts" numeric DEFAULT 1,
  	"quiz_settings_passing_score" numeric DEFAULT 70,
  	"quiz_settings_randomize_questions" boolean DEFAULT false,
  	"quiz_settings_show_correct_answers" "enum_lessons_quiz_settings_show_correct_answers" DEFAULT 'after_submit',
  	"assignment_instructions" jsonb,
  	"assignment_due_date" timestamp(3) with time zone,
  	"assignment_points" numeric,
  	"discussion_prompt" jsonb,
  	"discussion_settings_require_response" boolean DEFAULT true,
  	"discussion_settings_require_replies" numeric DEFAULT 2,
  	"discussion_settings_minimum_words" numeric,
  	"discussion_settings_due_date" timestamp(3) with time zone,
  	"status" "enum_lessons_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_lessons_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_lessons_v_version_quiz_questions_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"correct" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_lessons_v_version_quiz_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"type" "enum__lessons_v_version_quiz_questions_type",
  	"answer" varchar,
  	"points" numeric,
  	"explanation" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_lessons_v_version_assignment_rubric" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"criterion" varchar,
  	"points" numeric,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_lessons_v_version_assignment_allowed_file_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__lessons_v_version_assignment_allowed_file_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "_lessons_v_version_discussion_guidelines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_lessons_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_order" numeric,
  	"version_type" "enum__lessons_v_version_type",
  	"version_description" varchar,
  	"version_video_url" varchar,
  	"version_video_duration" numeric,
  	"version_video_transcript" varchar,
  	"version_content" jsonb,
  	"version_quiz_settings_time_limit" numeric,
  	"version_quiz_settings_attempts" numeric DEFAULT 1,
  	"version_quiz_settings_passing_score" numeric DEFAULT 70,
  	"version_quiz_settings_randomize_questions" boolean DEFAULT false,
  	"version_quiz_settings_show_correct_answers" "enum__lessons_v_version_quiz_settings_show_correct_answers" DEFAULT 'after_submit',
  	"version_assignment_instructions" jsonb,
  	"version_assignment_due_date" timestamp(3) with time zone,
  	"version_assignment_points" numeric,
  	"version_discussion_prompt" jsonb,
  	"version_discussion_settings_require_response" boolean DEFAULT true,
  	"version_discussion_settings_require_replies" numeric DEFAULT 2,
  	"version_discussion_settings_minimum_words" numeric,
  	"version_discussion_settings_due_date" timestamp(3) with time zone,
  	"version_status" "enum__lessons_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__lessons_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "students" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"full_name" varchar NOT NULL,
  	"provider" varchar NOT NULL,
  	"provider_account_id" varchar NOT NULL,
  	"image_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  
  CREATE TABLE IF NOT EXISTS "progress_module_progress" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"module_id" integer NOT NULL,
  	"status" "enum_progress_module_progress_status" NOT NULL,
  	"progress" numeric NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "progress_quiz_attempts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lesson_id" integer,
  	"score" numeric NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "progress_discussions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lesson_id" integer,
  	"participated_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "progress" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"student_id" integer NOT NULL,
  	"course_id" integer NOT NULL,
  	"status" "enum_progress_status" DEFAULT 'not_started' NOT NULL,
  	"overall_progress" numeric DEFAULT 0 NOT NULL,
  	"points_earned" numeric DEFAULT 0 NOT NULL,
  	"total_points" numeric DEFAULT 0 NOT NULL,
  	"started_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone,
  	"last_accessed" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "products_product_price" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"price" numeric NOT NULL,
  	"accepted_currency" "enum_products_product_price_accepted_currency" DEFAULT 'USD' NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"course_id" integer NOT NULL,
  	"product_status" "enum_products_product_status" DEFAULT 'active' NOT NULL,
  	"product_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "subscriptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_subscriptions_status",
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"user_id" integer,
  	"product_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"courses_id" integer,
  	"modules_id" integer,
  	"lessons_id" integer,
  	"students_id" integer,
  	"enrollments_id" integer,
  	"progress_id" integer,
  	"products_id" integer,
  	"subscriptions_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
   ALTER TABLE "courses" ADD CONSTRAINT "courses_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_modules_fk" FOREIGN KEY ("modules_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_parent_id_courses_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_modules_fk" FOREIGN KEY ("modules_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "modules" ADD CONSTRAINT "modules_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "modules_rels" ADD CONSTRAINT "modules_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "modules_rels" ADD CONSTRAINT "modules_rels_lessons_fk" FOREIGN KEY ("lessons_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_modules_v" ADD CONSTRAINT "_modules_v_parent_id_modules_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."modules"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_modules_v" ADD CONSTRAINT "_modules_v_version_course_id_courses_id_fk" FOREIGN KEY ("version_course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_modules_v_rels" ADD CONSTRAINT "_modules_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_modules_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_modules_v_rels" ADD CONSTRAINT "_modules_v_rels_lessons_fk" FOREIGN KEY ("lessons_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "lessons_quiz_questions_options" ADD CONSTRAINT "lessons_quiz_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lessons_quiz_questions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "lessons_quiz_questions" ADD CONSTRAINT "lessons_quiz_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "lessons_assignment_rubric" ADD CONSTRAINT "lessons_assignment_rubric_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "lessons_assignment_allowed_file_types" ADD CONSTRAINT "lessons_assignment_allowed_file_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "lessons_discussion_guidelines" ADD CONSTRAINT "lessons_discussion_guidelines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_lessons_v_version_quiz_questions_options" ADD CONSTRAINT "_lessons_v_version_quiz_questions_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lessons_v_version_quiz_questions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_lessons_v_version_quiz_questions" ADD CONSTRAINT "_lessons_v_version_quiz_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lessons_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_lessons_v_version_assignment_rubric" ADD CONSTRAINT "_lessons_v_version_assignment_rubric_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lessons_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_lessons_v_version_assignment_allowed_file_types" ADD CONSTRAINT "_lessons_v_version_assignment_allowed_file_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_lessons_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_lessons_v_version_discussion_guidelines" ADD CONSTRAINT "_lessons_v_version_discussion_guidelines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lessons_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_lessons_v" ADD CONSTRAINT "_lessons_v_parent_id_lessons_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
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
  
  DO $$ BEGIN
   ALTER TABLE "progress_module_progress" ADD CONSTRAINT "progress_module_progress_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "progress_module_progress" ADD CONSTRAINT "progress_module_progress_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."progress"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "progress_quiz_attempts" ADD CONSTRAINT "progress_quiz_attempts_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "progress_quiz_attempts" ADD CONSTRAINT "progress_quiz_attempts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."progress"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "progress_discussions" ADD CONSTRAINT "progress_discussions_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "progress_discussions" ADD CONSTRAINT "progress_discussions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."progress"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "progress" ADD CONSTRAINT "progress_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "progress" ADD CONSTRAINT "progress_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "products_product_price" ADD CONSTRAINT "products_product_price_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "products" ADD CONSTRAINT "products_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "products" ADD CONSTRAINT "products_product_image_id_media_id_fk" FOREIGN KEY ("product_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_students_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_modules_fk" FOREIGN KEY ("modules_id") REFERENCES "public"."modules"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lessons_fk" FOREIGN KEY ("lessons_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_students_fk" FOREIGN KEY ("students_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enrollments_fk" FOREIGN KEY ("enrollments_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_progress_fk" FOREIGN KEY ("progress_id") REFERENCES "public"."progress"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscriptions_fk" FOREIGN KEY ("subscriptions_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX IF NOT EXISTS "courses_slug_idx" ON "courses" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "courses_thumbnail_idx" ON "courses" USING btree ("thumbnail_id");
  CREATE INDEX IF NOT EXISTS "courses_updated_at_idx" ON "courses" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "courses_created_at_idx" ON "courses" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "courses__status_idx" ON "courses" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "courses_rels_order_idx" ON "courses_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "courses_rels_parent_idx" ON "courses_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "courses_rels_path_idx" ON "courses_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "courses_rels_categories_id_idx" ON "courses_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "courses_rels_modules_id_idx" ON "courses_rels" USING btree ("modules_id");
  CREATE INDEX IF NOT EXISTS "_courses_v_parent_idx" ON "_courses_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_courses_v_version_version_slug_idx" ON "_courses_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_courses_v_version_version_thumbnail_idx" ON "_courses_v" USING btree ("version_thumbnail_id");
  CREATE INDEX IF NOT EXISTS "_courses_v_version_version_updated_at_idx" ON "_courses_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_courses_v_version_version_created_at_idx" ON "_courses_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_courses_v_version_version__status_idx" ON "_courses_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_courses_v_created_at_idx" ON "_courses_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_courses_v_updated_at_idx" ON "_courses_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_courses_v_latest_idx" ON "_courses_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_courses_v_rels_order_idx" ON "_courses_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_courses_v_rels_parent_idx" ON "_courses_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_courses_v_rels_path_idx" ON "_courses_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_courses_v_rels_categories_id_idx" ON "_courses_v_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "_courses_v_rels_modules_id_idx" ON "_courses_v_rels" USING btree ("modules_id");
  CREATE INDEX IF NOT EXISTS "modules_course_idx" ON "modules" USING btree ("course_id");
  CREATE INDEX IF NOT EXISTS "modules_updated_at_idx" ON "modules" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "modules_created_at_idx" ON "modules" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "modules__status_idx" ON "modules" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "modules_rels_order_idx" ON "modules_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "modules_rels_parent_idx" ON "modules_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "modules_rels_path_idx" ON "modules_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "modules_rels_lessons_id_idx" ON "modules_rels" USING btree ("lessons_id");
  CREATE INDEX IF NOT EXISTS "_modules_v_parent_idx" ON "_modules_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_modules_v_version_version_course_idx" ON "_modules_v" USING btree ("version_course_id");
  CREATE INDEX IF NOT EXISTS "_modules_v_version_version_updated_at_idx" ON "_modules_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_modules_v_version_version_created_at_idx" ON "_modules_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_modules_v_version_version__status_idx" ON "_modules_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_modules_v_created_at_idx" ON "_modules_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_modules_v_updated_at_idx" ON "_modules_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_modules_v_latest_idx" ON "_modules_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_modules_v_rels_order_idx" ON "_modules_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_modules_v_rels_parent_idx" ON "_modules_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_modules_v_rels_path_idx" ON "_modules_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_modules_v_rels_lessons_id_idx" ON "_modules_v_rels" USING btree ("lessons_id");
  CREATE INDEX IF NOT EXISTS "lessons_quiz_questions_options_order_idx" ON "lessons_quiz_questions_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "lessons_quiz_questions_options_parent_id_idx" ON "lessons_quiz_questions_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "lessons_quiz_questions_order_idx" ON "lessons_quiz_questions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "lessons_quiz_questions_parent_id_idx" ON "lessons_quiz_questions" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "lessons_assignment_rubric_order_idx" ON "lessons_assignment_rubric" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "lessons_assignment_rubric_parent_id_idx" ON "lessons_assignment_rubric" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "lessons_assignment_allowed_file_types_order_idx" ON "lessons_assignment_allowed_file_types" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "lessons_assignment_allowed_file_types_parent_idx" ON "lessons_assignment_allowed_file_types" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "lessons_discussion_guidelines_order_idx" ON "lessons_discussion_guidelines" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "lessons_discussion_guidelines_parent_id_idx" ON "lessons_discussion_guidelines" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "lessons_updated_at_idx" ON "lessons" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "lessons_created_at_idx" ON "lessons" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "lessons__status_idx" ON "lessons" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_lessons_v_version_quiz_questions_options_order_idx" ON "_lessons_v_version_quiz_questions_options" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_lessons_v_version_quiz_questions_options_parent_id_idx" ON "_lessons_v_version_quiz_questions_options" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_lessons_v_version_quiz_questions_order_idx" ON "_lessons_v_version_quiz_questions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_lessons_v_version_quiz_questions_parent_id_idx" ON "_lessons_v_version_quiz_questions" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_lessons_v_version_assignment_rubric_order_idx" ON "_lessons_v_version_assignment_rubric" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_lessons_v_version_assignment_rubric_parent_id_idx" ON "_lessons_v_version_assignment_rubric" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_lessons_v_version_assignment_allowed_file_types_order_idx" ON "_lessons_v_version_assignment_allowed_file_types" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_lessons_v_version_assignment_allowed_file_types_parent_idx" ON "_lessons_v_version_assignment_allowed_file_types" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_lessons_v_version_discussion_guidelines_order_idx" ON "_lessons_v_version_discussion_guidelines" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_lessons_v_version_discussion_guidelines_parent_id_idx" ON "_lessons_v_version_discussion_guidelines" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_lessons_v_parent_idx" ON "_lessons_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_lessons_v_version_version_updated_at_idx" ON "_lessons_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_lessons_v_version_version_created_at_idx" ON "_lessons_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_lessons_v_version_version__status_idx" ON "_lessons_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_lessons_v_created_at_idx" ON "_lessons_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_lessons_v_updated_at_idx" ON "_lessons_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_lessons_v_latest_idx" ON "_lessons_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "students_updated_at_idx" ON "students" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "students_created_at_idx" ON "students" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "enrollments_student_idx" ON "enrollments" USING btree ("student_id");
  CREATE INDEX IF NOT EXISTS "enrollments_course_idx" ON "enrollments" USING btree ("course_id");
  CREATE INDEX IF NOT EXISTS "enrollments_updated_at_idx" ON "enrollments" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "enrollments_created_at_idx" ON "enrollments" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "progress_module_progress_order_idx" ON "progress_module_progress" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "progress_module_progress_parent_id_idx" ON "progress_module_progress" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "progress_module_progress_module_idx" ON "progress_module_progress" USING btree ("module_id");
  CREATE INDEX IF NOT EXISTS "progress_quiz_attempts_order_idx" ON "progress_quiz_attempts" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "progress_quiz_attempts_parent_id_idx" ON "progress_quiz_attempts" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "progress_quiz_attempts_lesson_idx" ON "progress_quiz_attempts" USING btree ("lesson_id");
  CREATE INDEX IF NOT EXISTS "progress_discussions_order_idx" ON "progress_discussions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "progress_discussions_parent_id_idx" ON "progress_discussions" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "progress_discussions_lesson_idx" ON "progress_discussions" USING btree ("lesson_id");
  CREATE INDEX IF NOT EXISTS "progress_student_idx" ON "progress" USING btree ("student_id");
  CREATE INDEX IF NOT EXISTS "progress_course_idx" ON "progress" USING btree ("course_id");
  CREATE INDEX IF NOT EXISTS "progress_updated_at_idx" ON "progress" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "progress_created_at_idx" ON "progress" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "products_product_price_order_idx" ON "products_product_price" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "products_product_price_parent_id_idx" ON "products_product_price" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "products_course_idx" ON "products" USING btree ("course_id");
  CREATE INDEX IF NOT EXISTS "products_product_image_idx" ON "products" USING btree ("product_image_id");
  CREATE INDEX IF NOT EXISTS "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "subscriptions_user_idx" ON "subscriptions" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "subscriptions_product_idx" ON "subscriptions" USING btree ("product_id");
  CREATE INDEX IF NOT EXISTS "subscriptions_updated_at_idx" ON "subscriptions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "subscriptions_created_at_idx" ON "subscriptions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("courses_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_modules_id_idx" ON "payload_locked_documents_rels" USING btree ("modules_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_lessons_id_idx" ON "payload_locked_documents_rels" USING btree ("lessons_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_students_id_idx" ON "payload_locked_documents_rels" USING btree ("students_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_enrollments_id_idx" ON "payload_locked_documents_rels" USING btree ("enrollments_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_progress_id_idx" ON "payload_locked_documents_rels" USING btree ("progress_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_subscriptions_id_idx" ON "payload_locked_documents_rels" USING btree ("subscriptions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "courses" CASCADE;
  DROP TABLE "courses_rels" CASCADE;
  DROP TABLE "_courses_v" CASCADE;
  DROP TABLE "_courses_v_rels" CASCADE;
  DROP TABLE "modules" CASCADE;
  DROP TABLE "modules_rels" CASCADE;
  DROP TABLE "_modules_v" CASCADE;
  DROP TABLE "_modules_v_rels" CASCADE;
  DROP TABLE "lessons_quiz_questions_options" CASCADE;
  DROP TABLE "lessons_quiz_questions" CASCADE;
  DROP TABLE "lessons_assignment_rubric" CASCADE;
  DROP TABLE "lessons_assignment_allowed_file_types" CASCADE;
  DROP TABLE "lessons_discussion_guidelines" CASCADE;
  DROP TABLE "lessons" CASCADE;
  DROP TABLE "_lessons_v_version_quiz_questions_options" CASCADE;
  DROP TABLE "_lessons_v_version_quiz_questions" CASCADE;
  DROP TABLE "_lessons_v_version_assignment_rubric" CASCADE;
  DROP TABLE "_lessons_v_version_assignment_allowed_file_types" CASCADE;
  DROP TABLE "_lessons_v_version_discussion_guidelines" CASCADE;
  DROP TABLE "_lessons_v" CASCADE;
  DROP TABLE "students" CASCADE;
  DROP TABLE "enrollments" CASCADE;
  DROP TABLE "progress_module_progress" CASCADE;
  DROP TABLE "progress_quiz_attempts" CASCADE;
  DROP TABLE "progress_discussions" CASCADE;
  DROP TABLE "progress" CASCADE;
  DROP TABLE "products_product_price" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "subscriptions" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_courses_status";
  DROP TYPE "public"."enum__courses_v_version_status";
  DROP TYPE "public"."enum_modules_status";
  DROP TYPE "public"."enum_modules_completion_criteria_type";
  DROP TYPE "public"."enum__modules_v_version_status";
  DROP TYPE "public"."enum__modules_v_version_completion_criteria_type";
  DROP TYPE "public"."enum_lessons_quiz_questions_type";
  DROP TYPE "public"."enum_lessons_assignment_allowed_file_types";
  DROP TYPE "public"."enum_lessons_type";
  DROP TYPE "public"."enum_lessons_quiz_settings_show_correct_answers";
  DROP TYPE "public"."enum_lessons_status";
  DROP TYPE "public"."enum__lessons_v_version_quiz_questions_type";
  DROP TYPE "public"."enum__lessons_v_version_assignment_allowed_file_types";
  DROP TYPE "public"."enum__lessons_v_version_type";
  DROP TYPE "public"."enum__lessons_v_version_quiz_settings_show_correct_answers";
  DROP TYPE "public"."enum__lessons_v_version_status";
  DROP TYPE "public"."enum_enrollments_status";
  DROP TYPE "public"."enum_progress_module_progress_status";
  DROP TYPE "public"."enum_progress_status";
  DROP TYPE "public"."enum_products_product_price_accepted_currency";
  DROP TYPE "public"."enum_products_product_status";
  DROP TYPE "public"."enum_subscriptions_status";`)
}
