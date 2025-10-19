import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async exportUserLessons(userId: string, format: 'json' | 'csv' | 'markdown') {
    // Fetch all user lessons with related data
    const lessons = await this.prisma['lesson'].findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const goals = await this.prisma['goal'].findMany({
      where: { userId },
      include: {
        sprints: true,
      },
    });

    const data = {
      exportedAt: new Date().toISOString(),
      user: lessons[0]?.user || {},
      stats: {
        totalLessons: lessons.length,
        goals: goals.length,
      },
      lessons: lessons.map((lesson) => ({
        id: lesson.id,
        content: lesson.contentRaw,
        summary: lesson.contentSummary,
        domain: lesson.domain,
        tags: lesson.tags,
        mood: lesson.mood,
        resonance: lesson.resonance,
        gratitude: lesson.gratitude,
        aiConcepts: lesson.aiConcepts,
        aiNextQuestion: lesson.aiNextQuestion,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt,
      })),
      goals: goals.map((goal) => ({
        id: goal.id,
        type: goal.type,
        target: goal.target,
        current: goal.current,
        sprintSize: goal.sprintSize,
        status: goal.status,
        sprints: goal.sprints.length,
      })),
    };

    switch (format) {
      case 'json':
        return {
          contentType: 'application/json',
          filename: `life-lessons-export-${Date.now()}.json`,
          data: JSON.stringify(data, null, 2),
        };

      case 'csv':
        return {
          contentType: 'text/csv',
          filename: `life-lessons-export-${Date.now()}.csv`,
          data: this.convertToCSV(data.lessons),
        };

      case 'markdown':
        return {
          contentType: 'text/markdown',
          filename: `life-lessons-export-${Date.now()}.md`,
          data: this.convertToMarkdown(data),
        };

      default:
        return data;
    }
  }

  private convertToCSV(lessons: any[]): string {
    if (lessons.length === 0) return '';

    const headers = ['Date', 'Domain', 'Content', 'Mood', 'Resonance', 'Tags', 'Gratitude'];
    const rows = lessons.map((lesson) => [
      new Date(lesson.createdAt).toLocaleDateString(),
      lesson.domain,
      `"${lesson.content.replace(/"/g, '""')}"`,
      lesson.mood,
      lesson.resonance,
      lesson.tags.join('; '),
      lesson.gratitude ? `"${lesson.gratitude.replace(/"/g, '""')}"` : '',
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  private convertToMarkdown(data: any): string {
    let md = `# Life Lessons Export\n\n`;
    md += `**Exported:** ${new Date(data.exportedAt).toLocaleString()}\n`;
    md += `**Total Lessons:** ${data.stats.totalLessons}\n\n`;

    md += `## Goals\n\n`;
    data.goals.forEach((goal: any) => {
      md += `- **${goal.type}**: ${goal.current}/${goal.target} (${goal.status})\n`;
    });

    md += `\n## Lessons\n\n`;
    data.lessons.forEach((lesson: any, index: number) => {
      md += `### ${index + 1}. ${new Date(lesson.createdAt).toLocaleDateString()} - ${lesson.domain}\n\n`;
      md += `${lesson.content}\n\n`;

      if (lesson.summary) {
        md += `**Summary:** ${lesson.summary}\n\n`;
      }

      if (lesson.tags.length > 0) {
        md += `**Tags:** ${lesson.tags.map((t: string) => `\`${t}\``).join(', ')}\n\n`;
      }

      if (lesson.aiConcepts.length > 0) {
        md += `**Concepts:** ${lesson.aiConcepts.join(', ')}\n\n`;
      }

      if (lesson.gratitude) {
        md += `**Gratitude:** ${lesson.gratitude}\n\n`;
      }

      md += `**Mood:** ${lesson.mood} | **Resonance:** ${lesson.resonance}\n\n`;
      md += `---\n\n`;
    });

    return md;
  }
}
