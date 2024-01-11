-- DropForeignKey
ALTER TABLE "PostShared" DROP CONSTRAINT "PostShared_postId_fkey";

-- DropIndex
DROP INDEX "Post_postId_key";

-- CreateTable
CREATE TABLE "PostParent" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "postParentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostParent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostParent" ADD CONSTRAINT "PostParent_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostParent" ADD CONSTRAINT "PostParent_postParentId_fkey" FOREIGN KEY ("postParentId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostShared" ADD CONSTRAINT "PostShared_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
