import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

const DateRangePanel = forwardRef(function DateRangePanel(props, ref) {
  const { t } = useTranslation();

  return (
    <div className="date-range-panel" ref={ref}>
      {/* Верхние табы */}
      <div className="dr-tabs">
        <button className="dr-tab dr-tab-active">
          {t('datePanel.tabDates')}
        </button>
        <button className="dr-tab">
          {t('datePanel.tabMonths')}
        </button>
        <button className="dr-tab">
          {t('datePanel.tabFlexible')}
        </button>
      </div>

      <div className="dr-content">
        {/* Левый месяц */}
        <div className="dr-month">
          <div className="dr-month-header">
            <button className="dr-nav-btn">&lt;</button>
            <span className="dr-month-title">
              {t('datePanel.monthLeft')}
            </span>
          </div>

          <div className="dr-weekdays">
            <span>{t('datePanel.weekMon')}</span>
            <span>{t('datePanel.weekTue')}</span>
            <span>{t('datePanel.weekWed')}</span>
            <span>{t('datePanel.weekThu')}</span>
            <span>{t('datePanel.weekFri')}</span>
            <span>{t('datePanel.weekSat')}</span>
            <span>{t('datePanel.weekSun')}</span>
          </div>

          <div className="dr-days">
            <span className="dr-day dr-day-empty"></span>
            <span className="dr-day dr-day-empty"></span>
            <span className="dr-day">1</span>
            <span className="dr-day">2</span>
            <span className="dr-day">3</span>
            <span className="dr-day">4</span>
            <span className="dr-day">5</span>

            <span className="dr-day">6</span>
            <span className="dr-day">7</span>
            <span className="dr-day">8</span>
            <span className="dr-day">9</span>
            <span className="dr-day">10</span>
            <span className="dr-day">11</span>
            <span className="dr-day">12</span>

            <span className="dr-day">13</span>
            <span className="dr-day">14</span>
            <span className="dr-day">15</span>
            <span className="dr-day">16</span>
            <span className="dr-day">17</span>
            <span className="dr-day">18</span>
            <span className="dr-day">19</span>

            <span className="dr-day">20</span>
            <span className="dr-day dr-day-in-range">21</span>
            <span className="dr-day dr-day-in-range">22</span>
            <span className="dr-day dr-day-in-range">23</span>
            <span className="dr-day">24</span>
            <span className="dr-day">25</span>
            <span className="dr-day">26</span>

            <span className="dr-day">27</span>
            <span className="dr-day">28</span>
            <span className="dr-day">29</span>
            <span className="dr-day">30</span>
            <span className="dr-day dr-day-empty"></span>
            <span className="dr-day dr-day-empty"></span>
            <span className="dr-day dr-day-empty"></span>
          </div>
        </div>

        {/* Правый месяц */}
        <div className="dr-month">
          <div className="dr-month-header">
            <span className="dr-month-title">
              {t('datePanel.monthRight')}
            </span>
            <button className="dr-nav-btn">&gt;</button>
          </div>

          <div className="dr-weekdays">
            <span>{t('datePanel.weekMon')}</span>
            <span>{t('datePanel.weekTue')}</span>
            <span>{t('datePanel.weekWed')}</span>
            <span>{t('datePanel.weekThu')}</span>
            <span>{t('datePanel.weekFri')}</span>
            <span>{t('datePanel.weekSat')}</span>
            <span>{t('datePanel.weekSun')}</span>
          </div>

          <div className="dr-days">
            <span className="dr-day dr-day-empty"></span>
            <span className="dr-day">1</span>
            <span className="dr-day">2</span>
            <span className="dr-day">3</span>
            <span className="dr-day">4</span>
            <span className="dr-day">5</span>
            <span className="dr-day">6</span>
            <span className="dr-day">7</span>

            <span className="dr-day dr-day-in-range">8</span>
            <span className="dr-day dr-day-in-range">9</span>
            <span className="dr-day dr-day-in-range">10</span>
            <span className="dr-day dr-day-in-range">11</span>
            <span className="dr-day dr-day-in-range">12</span>
            <span className="dr-day dr-day-in-range">13</span>
            <span className="dr-day dr-day-in-range dr-day-end">14</span>

            <span className="dr-day">15</span>
            <span className="dr-day">16</span>
            <span className="dr-day">17</span>
            <span className="dr-day">18</span>
            <span className="dr-day">19</span>
            <span className="dr-day">20</span>
            <span className="dr-day">21</span>

            <span className="dr-day">22</span>
            <span className="dr-day">23</span>
            <span className="dr-day">24</span>
            <span className="dr-day">25</span>
            <span className="dr-day">26</span>
            <span className="dr-day">27</span>
            <span className="dr-day">28</span>

            <span className="dr-day">29</span>
            <span className="dr-day">30</span>
            <span className="dr-day">31</span>
            <span className="dr-day dr-day-empty"></span>
            <span className="dr-day dr-day-empty"></span>
            <span className="dr-day dr-day-empty"></span>
            <span className="dr-day dr-day-empty"></span>
          </div>
        </div>
      </div>

      {/* Нижние чипы */}
      <div className="dr-footer">
        <button className="dr-chip dr-chip-active">
          {t('datePanel.chipExact')}
        </button>
        <button className="dr-chip">
          {t('datePanel.chipPlus1')}
        </button>
        <button className="dr-chip">
          {t('datePanel.chipPlus2')}
        </button>
        <button className="dr-chip">
          {t('datePanel.chipPlus3')}
        </button>
        <button className="dr-chip">
          {t('datePanel.chipPlus7')}
        </button>
        <button className="dr-chip">
          {t('datePanel.chipPlus14')}
        </button>
      </div>
    </div>
  );
});

export default DateRangePanel;
