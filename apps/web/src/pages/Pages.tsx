import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { DEVELOPMENT_STAGE } from '@date-planner/shared';

function Stage({ title, description }: { title: string; description: string }) {
  return (
    <>
      <span className="stage">{DEVELOPMENT_STAGE} · 개발 기반 준비 완료</span>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 leading-7 text-stone-500">{description}</p>
      <div className="mt-10 rounded-3xl border border-dashed border-stone-300 p-7">
        <p className="font-medium">함께할 순간을 준비하고 있어요</p>
        <p className="mt-3 text-sm leading-6 text-stone-500">
          지금은 프로젝트 초기 구성 단계입니다.
          <br />
          실제 기능은 다음 개발 단계에서 만나요.
        </p>
      </div>
    </>
  );
}

export function HomePage() {
  return (
    <>
      <span className="stage">{DEVELOPMENT_STAGE} · 개발 기반 준비 완료</span>
      <p className="mt-8 text-sm text-stone-500">OUR NEXT MOMENT</p>
      <h1 className="mt-3 text-4xl leading-tight font-semibold tracking-tight">
        HomePage
        <br />
        <span className="text-emerald-800">우리의 다음 데이트</span>
      </h1>
      <p className="mt-5 leading-7 text-stone-500">
        가고 싶은 곳부터 함께할 하루까지.
        <br />
        둘만의 이야기가 시작될 공간을 준비했어요.
      </p>
      <section aria-label="시작하기" className="mt-10 grid gap-4">
        {[
          {
            to: '/places',
            title: '함께 가고 싶은 장소',
            description: '둘만의 장소 모음이 생길 거예요',
            icon: MapPin,
          },
          {
            to: '/plans',
            title: '기다려지는 다음 일정',
            description: '함께 만드는 하루를 준비해요',
            icon: CalendarDays,
          },
        ].map(({ to, title, description, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-4 rounded-3xl border border-stone-200 bg-white p-6"
          >
            <Icon className="text-emerald-800" size={24} />
            <div className="flex-1">
              <h2 className="font-medium">{title}</h2>
              <p className="mt-1 text-xs text-stone-500">{description}</p>
            </div>
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        ))}
      </section>
      <p className="mt-8 text-xs leading-6 text-stone-500">
        로그인 · 장소 저장 · 지도 검색은 아직 제공되지 않아요.
      </p>
    </>
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
