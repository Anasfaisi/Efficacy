import { BadgeTemplate, GamificationEvent } from '../types/gamification.types';

export interface ITemplateConfig {
  template: BadgeTemplate;
  metric: string; 
  operator: '>=' | '==';
  triggerEvent: GamificationEvent;
}

export const badgeTemplates: Record<BadgeTemplate, ITemplateConfig> = {
  [BadgeTemplate.TASK_COUNT]: {
    template: BadgeTemplate.TASK_COUNT,
    metric: 'tasksCompleted',
    operator: '>=',
    triggerEvent: GamificationEvent.TASK_COMPLETED
  },
  [BadgeTemplate.TASK_STREAK]: {
    template: BadgeTemplate.TASK_STREAK,
    metric: 'taskStreakDays',
    operator: '>=',
    triggerEvent: GamificationEvent.STREAK_UPDATED
  },
  [BadgeTemplate.POMODORO_COUNT]: {
    template: BadgeTemplate.POMODORO_COUNT,
    metric: 'pomodorosCompleted',
    operator: '>=',
    triggerEvent: GamificationEvent.POMODORO_COMPLETED
  },
  [BadgeTemplate.FOCUS_TIME]: {
    template: BadgeTemplate.FOCUS_TIME,
    metric: 'focusMinutes',
    operator: '>=',
    triggerEvent: GamificationEvent.FOCUS_TIME_UPDATED
  },
  [BadgeTemplate.SESSION_COUNT]: {
    template: BadgeTemplate.SESSION_COUNT,
    metric: 'sessionsCompleted',
    operator: '>=',
    triggerEvent: GamificationEvent.SESSION_COMPLETED
  }
};
