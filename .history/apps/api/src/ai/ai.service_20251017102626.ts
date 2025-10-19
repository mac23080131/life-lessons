import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Domain } from '@prisma/client';

/**
 * Mock AI Service for analyzing lessons
 * V1: Rule-based implementation
 * TODO V1.1: Replace with LLM integration (OpenAI/Anthropic)
 * 
 * Prompt for future LLM:
 * "Tóm tắt 1–2 câu, liệt kê 3 'điểm rọi', đề xuất 1 'khái niệm nguồn có lợi' (<=15 từ),
 * và 1 câu hỏi tiếp theo. Ngôn ngữ: theo đầu vào; văn phong trung tính, không phán xét."
 */
@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async analyzeLesson(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Mock analysis
    const analysis = this.mockAnalyze(lesson.contentRaw, lesson.domain);

    // Update lesson with AI results
    await this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        contentSummary: analysis.summary,
        aiConcepts: analysis.concepts,
        aiNextQuestion: analysis.nextQuestion,
      },
    });

    return analysis;
  }

  private mockAnalyze(content: string, domain: Domain) {
    // Extract summary: first sentence + last sentence
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const summary =
      sentences.length > 1
        ? `${sentences[0].trim()}. ${sentences[sentences.length - 1].trim()}.`
        : sentences[0]?.trim() || 'No summary available';

    // Extract concepts: simple keyword extraction
    const concepts = this.extractKeywords(content);

    // Generate next question based on domain
    const nextQuestion = this.generateNextQuestion(domain, content);

    return {
      summary,
      concepts,
      nextQuestion,
    };
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction: get 3-5 most frequent words
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 4); // Words longer than 4 chars

    const wordCount: Record<string, number> = {};
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const sortedWords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);

    return sortedWords.slice(0, 3);
  }

  private generateNextQuestion(domain: Domain, _content: string): string {
    const questions = {
      [Domain.INNER]: [
        'Bài học này ảnh hưởng thế nào đến suy nghĩ của bạn về bản thân?',
        'Bạn có thể áp dụng nhận định này vào tình huống nào khác?',
        'Điều gì khiến bạn cảm thấy sâu sắc nhất trong trải nghiệm này?',
      ],
      [Domain.HEALTH]: [
        'Bạn có thể duy trì thói quen này như thế nào?',
        'Điều gì cản trở bạn thực hiện thường xuyên hơn?',
        'Cơ thể bạn phản ứng ra sao khi bạn làm điều này?',
      ],
      [Domain.RELATIONSHIP]: [
        'Bạn có thể áp dụng bài học này với người khác không?',
        'Điều gì sẽ thay đổi nếu bạn thực hành điều này thường xuyên?',
        'Ai là người bạn muốn chia sẻ điều này?',
      ],
      [Domain.FINANCE]: [
        'Bạn có thể đo lường tác động của điều này như thế nào?',
        'Bước tiếp theo để duy trì momentum này là gì?',
        'Bài học này liên quan đến mục tiêu tài chính dài hạn của bạn ra sao?',
      ],
    };

    const domainQuestions = questions[domain] || questions[Domain.INNER];
    return domainQuestions[Math.floor(Math.random() * domainQuestions.length)];
  }
}
