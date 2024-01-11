/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PostShared" DROP CONSTRAINT "PostShared_postId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Post_postId_key" ON "Post"("postId");

-- AddForeignKey
ALTER TABLE "PostShared" ADD CONSTRAINT "PostShared_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("postId") ON DELETE CASCADE ON UPDATE CASCADE;
