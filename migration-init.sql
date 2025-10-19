-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Privacy" AS ENUM ('PRIVATE', 'GROUP', 'LINK', 'PUBLIC_ANON');

-- CreateEnum
CREATE TYPE "Domain" AS ENUM ('INNER', 'HEALTH', 'RELATIONSHIP', 'FINANCE');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('DAILY_EVENING', 'WEEKLY_REVIEW', 'MONTHLY_RETRO');

-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('COMMUNITY', 'GROUP', 'PERSONAL');

-- CreateEnum
CREATE TYPE "ChallengeScope" AS ENUM ('LESSON_COUNT', 'STREAK', 'DOMAIN_BALANCE', 'DAILY_PRACTICE');

-- CreateEnum
CREATE TYPE "ChallengeDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'FAILED', 'PAUSED');

-- CreateEnum
CREATE TYPE "ConceptDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('REFLECTIVE', 'PROVOCATIVE', 'ACTION_ORIENTED', 'EXPLORATORY');

-- CreateEnum
CREATE TYPE "ConceptRelType" AS ENUM ('BROADER', 'NARROWER', 'RELATED', 'ANTONYM');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BOOKMARKED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "locale" TEXT DEFAULT 'vi',
    "tz" TEXT DEFAULT 'Asia/Bangkok',
    "privacyDefault" "Privacy" NOT NULL DEFAULT 'PRIVATE',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentRaw" TEXT NOT NULL,
    "contentSummary" TEXT,
    "domain" "Domain" NOT NULL,
    "tags" TEXT[],
    "mood" INTEGER NOT NULL,
    "resonance" INTEGER NOT NULL,
    "gratitude" TEXT,
    "attachments" TEXT[],
    "visibility" "Privacy" NOT NULL DEFAULT 'PRIVATE',
    "language" TEXT,
    "aiConcepts" TEXT[],
    "aiNextQuestion" TEXT,
    "shareToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "target" INTEGER NOT NULL DEFAULT 10000,
    "current" INTEGER NOT NULL DEFAULT 0,
    "sprintSize" INTEGER NOT NULL DEFAULT 100,
    "cadence" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sprints" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "target" INTEGER NOT NULL,
    "done" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ReminderType" NOT NULL,
    "hour" INTEGER NOT NULL,
    "channel" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "inviteCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reactions" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_lessons" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "sharedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ChallengeType" NOT NULL DEFAULT 'COMMUNITY',
    "scope" "ChallengeScope" NOT NULL DEFAULT 'LESSON_COUNT',
    "target" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "difficulty" "ChallengeDifficulty" NOT NULL DEFAULT 'MEDIUM',
    "groupId" TEXT,
    "createdBy" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_participants" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "current" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "status" "ChallengeStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "challenge_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concept_categories" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "concept_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concepts" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "tags" TEXT[],
    "difficulty" "ConceptDifficulty" NOT NULL DEFAULT 'BEGINNER',
    "source" TEXT,
    "sourceUrl" TEXT,
    "imageUrl" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "aiContext" TEXT NOT NULL,
    "keywords" TEXT[],
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "concepts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concept_practices" (
    "id" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "steps" TEXT[],
    "stepsEn" TEXT[],
    "duration" INTEGER,
    "difficulty" "ConceptDifficulty" NOT NULL DEFAULT 'BEGINNER',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "concept_practices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concept_examples" (
    "id" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "textEn" TEXT NOT NULL,
    "source" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "concept_examples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concept_questions" (
    "id" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "questionEn" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'REFLECTIVE',
    "context" TEXT,
    "contextEn" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "concept_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concept_aliases" (
    "id" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'vi',

    CONSTRAINT "concept_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concept_relations" (
    "id" TEXT NOT NULL,
    "aId" TEXT NOT NULL,
    "bId" TEXT NOT NULL,
    "type" "ConceptRelType" NOT NULL,

    CONSTRAINT "concept_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_concept_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "practicesCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "lastViewedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "rating" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_concept_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_concepts" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "relevance" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "source" TEXT NOT NULL DEFAULT 'ai',
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_concepts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concept_embeddings" (
    "id" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "concept_embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_shareToken_key" ON "lessons"("shareToken");

-- CreateIndex
CREATE INDEX "lessons_userId_idx" ON "lessons"("userId");

-- CreateIndex
CREATE INDEX "lessons_domain_idx" ON "lessons"("domain");

-- CreateIndex
CREATE INDEX "lessons_createdAt_idx" ON "lessons"("createdAt");

-- CreateIndex
CREATE INDEX "goals_userId_idx" ON "goals"("userId");

-- CreateIndex
CREATE INDEX "sprints_goalId_idx" ON "sprints"("goalId");

-- CreateIndex
CREATE INDEX "reminders_userId_idx" ON "reminders"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "groups_inviteCode_key" ON "groups"("inviteCode");

-- CreateIndex
CREATE INDEX "memberships_userId_idx" ON "memberships"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_groupId_userId_key" ON "memberships"("groupId", "userId");

-- CreateIndex
CREATE INDEX "reactions_lessonId_idx" ON "reactions"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_lessonId_userId_type_key" ON "reactions"("lessonId", "userId", "type");

-- CreateIndex
CREATE INDEX "group_lessons_groupId_idx" ON "group_lessons"("groupId");

-- CreateIndex
CREATE INDEX "group_lessons_lessonId_idx" ON "group_lessons"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "group_lessons_groupId_lessonId_key" ON "group_lessons"("groupId", "lessonId");

-- CreateIndex
CREATE INDEX "challenges_type_idx" ON "challenges"("type");

-- CreateIndex
CREATE INDEX "challenges_groupId_idx" ON "challenges"("groupId");

-- CreateIndex
CREATE INDEX "challenges_isActive_idx" ON "challenges"("isActive");

-- CreateIndex
CREATE INDEX "challenge_participants_userId_idx" ON "challenge_participants"("userId");

-- CreateIndex
CREATE INDEX "challenge_participants_challengeId_idx" ON "challenge_participants"("challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "challenge_participants_challengeId_userId_key" ON "challenge_participants"("challengeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "concept_categories_key_key" ON "concept_categories"("key");

-- CreateIndex
CREATE UNIQUE INDEX "concepts_key_key" ON "concepts"("key");

-- CreateIndex
CREATE UNIQUE INDEX "concepts_slug_key" ON "concepts"("slug");

-- CreateIndex
CREATE INDEX "concepts_categoryId_idx" ON "concepts"("categoryId");

-- CreateIndex
CREATE INDEX "concepts_tags_idx" ON "concepts"("tags");

-- CreateIndex
CREATE INDEX "concepts_keywords_idx" ON "concepts"("keywords");

-- CreateIndex
CREATE INDEX "concepts_difficulty_idx" ON "concepts"("difficulty");

-- CreateIndex
CREATE INDEX "concept_practices_conceptId_idx" ON "concept_practices"("conceptId");

-- CreateIndex
CREATE INDEX "concept_examples_conceptId_idx" ON "concept_examples"("conceptId");

-- CreateIndex
CREATE INDEX "concept_questions_conceptId_idx" ON "concept_questions"("conceptId");

-- CreateIndex
CREATE INDEX "concept_questions_type_idx" ON "concept_questions"("type");

-- CreateIndex
CREATE INDEX "concept_aliases_conceptId_idx" ON "concept_aliases"("conceptId");

-- CreateIndex
CREATE INDEX "concept_relations_aId_idx" ON "concept_relations"("aId");

-- CreateIndex
CREATE INDEX "concept_relations_bId_idx" ON "concept_relations"("bId");

-- CreateIndex
CREATE UNIQUE INDEX "concept_relations_aId_bId_type_key" ON "concept_relations"("aId", "bId", "type");

-- CreateIndex
CREATE INDEX "user_concept_progress_userId_idx" ON "user_concept_progress"("userId");

-- CreateIndex
CREATE INDEX "user_concept_progress_conceptId_idx" ON "user_concept_progress"("conceptId");

-- CreateIndex
CREATE INDEX "user_concept_progress_status_idx" ON "user_concept_progress"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_concept_progress_userId_conceptId_key" ON "user_concept_progress"("userId", "conceptId");

-- CreateIndex
CREATE INDEX "lesson_concepts_lessonId_idx" ON "lesson_concepts"("lessonId");

-- CreateIndex
CREATE INDEX "lesson_concepts_conceptId_idx" ON "lesson_concepts"("conceptId");

-- CreateIndex
CREATE INDEX "lesson_concepts_relevance_idx" ON "lesson_concepts"("relevance");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_concepts_lessonId_conceptId_key" ON "lesson_concepts"("lessonId", "conceptId");

-- CreateIndex
CREATE UNIQUE INDEX "concept_embeddings_conceptId_key" ON "concept_embeddings"("conceptId");

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprints" ADD CONSTRAINT "sprints_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_lessons" ADD CONSTRAINT "group_lessons_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_lessons" ADD CONSTRAINT "group_lessons_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concepts" ADD CONSTRAINT "concepts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "concept_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concept_practices" ADD CONSTRAINT "concept_practices_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concept_examples" ADD CONSTRAINT "concept_examples_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concept_questions" ADD CONSTRAINT "concept_questions_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concept_aliases" ADD CONSTRAINT "concept_aliases_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concept_relations" ADD CONSTRAINT "concept_relations_aId_fkey" FOREIGN KEY ("aId") REFERENCES "concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concept_relations" ADD CONSTRAINT "concept_relations_bId_fkey" FOREIGN KEY ("bId") REFERENCES "concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_concept_progress" ADD CONSTRAINT "user_concept_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_concept_progress" ADD CONSTRAINT "user_concept_progress_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_concepts" ADD CONSTRAINT "lesson_concepts_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_concepts" ADD CONSTRAINT "lesson_concepts_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concept_embeddings" ADD CONSTRAINT "concept_embeddings_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

