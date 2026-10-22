import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Heart,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { DEVELOPMENT_STAGE } from '@date-planner/shared';

const countdownRanges = [
  { label: '1주일', days: 7 },
  { label: '3개월', days: 90 },
  { label: '6개월', days: 180 },
  { label: '1년', days: 365 },
] as const;

const samplePlans = [
  { days: 3, title: '한강 피크닉', place: '반포 한강공원', kind: '산책' },
  { days: 12, title: '성수동에서 보내는 오후', place: '성수동', kind: '카페' },
  { days: 37, title: '가을 단풍 데이트', place: '남산 둘레길', kind: '나들이' },
  {
    days: 92,
    title: '연말 저녁 약속',
    place: '장소를 함께 골라봐요',
    kind: '저녁',
  },
  {
    days: 171,
    title: '봄날의 피크닉',
    place: '장소를 함께 골라봐요',
    kind: '나들이',
  },
  {
    days: 310,
    title: '우리의 다음 기념일',
    place: '장소를 함께 골라봐요',
    kind: '기념일',
  },
] as const;

function formatPlanDate(daysFromToday: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
}

function Stage({ title, description }: { title: string; description: string }) {
  return (
    <>
      <span className="stage">{DEVELOPMENT_STAGE} · 개발 기반 준비 완료</span>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="stage-description">{description}</p>
      <div className="stage-placeholder">
        <p className="stage-placeholder-title">함께할 순간을 준비하고 있어요</p>
        <p className="stage-placeholder-description">
          지금은 프로젝트 초기 구성 단계입니다.
          <br />
          실제 기능은 다음 개발 단계에서 만나요.
        </p>
      </div>
    </>
  );
}

export function HomePage() {
  const [selectedRange, setSelectedRange] =
    useState<(typeof countdownRanges)[number]['label']>('3개월');
  const activeRange = countdownRanges.find(
    (range) => range.label === selectedRange,
  )!;
  const visiblePlans = useMemo(
    () => samplePlans.filter((plan) => plan.days <= activeRange.days),
    [activeRange],
  );
  const nextPlan = visiblePlans[0];

  return (
    <div className="home-page">
      <div className="home-intro">
        <span className="stage">{DEVELOPMENT_STAGE} · 개발 기반 준비 완료</span>
        <p className="eyebrow mt-7">TOGETHER, SOON</p>
        <h1 className="home-title">
          다음 데이트가
          <br />
          <span>기다려지는 이유</span>
        </h1>
        <p className="home-description">
          둘이 약속한 날까지,
          <br />
          설레는 시간을 세어봐요.
        </p>
      </div>

      <section className="countdown-section" aria-labelledby="countdown-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR NEXT MOMENT</p>
            <h2 id="countdown-title">데이트 카운트다운</h2>
          </div>
          <span className="preview-label">
            <Sparkles size={13} /> 미리보기
          </span>
        </div>

        <div className="range-tabs" role="group" aria-label="일정 조회 기간">
          {countdownRanges.map((range) => (
            <button
              key={range.label}
              type="button"
              className={`range-tab ${selectedRange === range.label ? 'is-active' : ''}`}
              aria-pressed={selectedRange === range.label}
              onClick={() => setSelectedRange(range.label)}
            >
              {range.label}
            </button>
          ))}
        </div>

        {nextPlan ? (
          <article className="next-date-card">
            <div className="card-orbit card-orbit-one" aria-hidden="true" />
            <div className="card-orbit card-orbit-two" aria-hidden="true" />
            <div className="next-date-topline">
              <span>
                <Heart size={14} fill="currentColor" /> 가장 가까운 약속
              </span>
              <span className="date-kind">{nextPlan.kind}</span>
            </div>
            <div className="next-date-content">
              <div>
                <p className="next-date-title">{nextPlan.title}</p>
                <p className="next-date-place">
                  <MapPin size={14} /> {nextPlan.place}
                </p>
              </div>
              <p className="day-count" aria-label={`${nextPlan.days}일 남음`}>
                <span>D-</span>
                {String(nextPlan.days).padStart(2, '0')}
              </p>
            </div>
            <div className="next-date-footer">
              <span>
                <CalendarDays size={14} /> {formatPlanDate(nextPlan.days)}
              </span>
              <span>
                <Clock3 size={14} /> 곧 만나요
              </span>
            </div>
          </article>
        ) : (
          <div className="empty-countdown">
            <CalendarDays size={22} />
            <p>이 기간에 예정된 데이트가 없어요.</p>
            <span>새로운 약속을 함께 계획해 보세요.</span>
          </div>
        )}

        <div className="upcoming-heading">
          <div>
            <h3>다가오는 약속</h3>
            <span>{visiblePlans.length}개의 일정</span>
          </div>
          <Link to="/plans" className="text-link">
            일정 보기 <ArrowRight size={15} />
          </Link>
        </div>
        <div className="upcoming-list">
          {visiblePlans.slice(1, 3).map((plan) => (
            <article key={plan.title} className="upcoming-card">
              <span className="upcoming-date">
                <strong>{String(plan.days).padStart(2, '0')}</strong>
                <small>일 후</small>
              </span>
              <div className="upcoming-copy">
                <h4>{plan.title}</h4>
                <p>
                  {formatPlanDate(plan.days)} · {plan.place}
                </p>
              </div>
              <span className="upcoming-kind">{plan.kind}</span>
            </article>
          ))}
          {visiblePlans.length < 2 && (
            <p className="upcoming-empty">
              선택한 기간에 다른 약속은 아직 없어요.
            </p>
          )}
        </div>
      </section>

      <section className="home-shortcuts" aria-label="바로 가기">
        <Link to="/places" className="shortcut-card">
          <span className="shortcut-icon">
            <MapPin size={19} />
          </span>
          <span>
            <strong>함께 가고 싶은 장소</strong>
            <small>둘만의 장소를 모아봐요</small>
          </span>
          <ArrowRight size={17} />
        </Link>
        <Link to="/plans" className="shortcut-card">
          <span className="shortcut-icon">
            <CalendarDays size={19} />
          </span>
          <span>
            <strong>우리의 데이트 일정</strong>
            <small>다음 하루를 계획해요</small>
          </span>
          <ArrowRight size={17} />
        </Link>
      </section>
      <p className="prototype-note">
        화면 확인을 위한 예시 일정이에요. 실제 일정 기능은 이후 작업에서
        연결됩니다.
      </p>
    </div>
  );
}
export function LoginPage() {
  return (
    <Stage
      title="LoginPage · 로그인"
      description="카카오 로그인은 TASK-03에서 연결할 예정이에요."
    />
  );
}
export function PlacesPage() {
  return (
    <Stage
      title="PlacesPage · 장소"
      description="함께 가고 싶은 장소를 모을 공간이에요. 장소 저장 기능은 아직 준비 중이에요."
    />
  );
}
export function PlansPage() {
  return (
    <Stage
      title="PlansPage · 일정"
      description="둘이 함께 데이트 일정을 계획할 공간이에요. 일정 기능은 아직 준비 중이에요."
    />
  );
}
export function MapPage() {
  return (
    <Stage
      title="MapPage · 지도"
      description="카카오 지도와 장소 검색은 TASK-05에서 연결할 예정이에요."
    />
  );
}
export function SettingsPage() {
  return (
    <>
      <Stage
        title="SettingsPage · 설정"
        description="서비스 설정을 위한 기본 화면이에요."
      />
      <Link to="/login" className="action inline-block">
        로그인 페이지 보기
      </Link>
    </>
  );
}
