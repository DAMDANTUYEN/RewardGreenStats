"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, QrCode } from "lucide-react";

import { namCatTienImpact } from "@/data/nam-cat-tien";
import { formatVnd } from "@/lib/impact";

import { BrandMark } from "./BrandMark";
import { ImpactJourney } from "./impact-journey/ImpactJourney";

export function TicketExperience() {
  const [impactOpen, setImpactOpen] = useState(false);

  return (
    <main className={`demo-page${impactOpen ? " demo-page--behind" : ""}`}>
      <picture className="demo-page__background">
        <source
          media="(max-width: 680px)"
          srcSet={namCatTienImpact.backgroundImageMobile}
        />
        <img src={namCatTienImpact.backgroundImage} alt="" />
      </picture>
      <div className="demo-page__veil" aria-hidden="true" />

      <Link
        href="/destinations?expand=1"
        className="impact-page__back"
        aria-label="Quay lại chi tiết Nam Cát Tiên"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        <span>Nam Cát Tiên</span>
      </Link>

      <section className="demo-ticket" aria-labelledby="ticket-title">
        <header className="demo-ticket__brand">
          <span className="demo-ticket__mark">
            <BrandMark />
          </span>
          <span>
            Green<strong>Stats</strong>
          </span>
        </header>

        <div className="demo-ticket__heading">
          <p>Vườn quốc gia</p>
          <h1 id="ticket-title">Nam Cát Tiên</h1>
          <span>
            <MapPin size={15} aria-hidden="true" />
            Đồng Nai, Việt Nam
          </span>
        </div>

        <div className="demo-ticket__divider" aria-hidden="true" />

        <dl className="demo-ticket__facts">
          <div>
            <dt>Ngày tham quan</dt>
            <dd>
              <CalendarDays size={16} aria-hidden="true" />
              26.07.2026
            </dd>
          </div>
          <div>
            <dt>Mã vé</dt>
            <dd>{namCatTienImpact.ticketId}</dd>
          </div>
          <div>
            <dt>Đóng góp bảo tồn</dt>
            <dd className="demo-ticket__contribution">
              {formatVnd(namCatTienImpact.totalContribution)}
            </dd>
          </div>
        </dl>

        <div className="demo-ticket__impact">
          <span className="demo-ticket__qr" aria-label="Mã QR của vé">
            <QrCode size={25} />
          </span>
          <p>
            Chiếc vé này đang hỗ trợ bốn hoạt động bảo tồn tại Nam Cát Tiên.
          </p>
        </div>

        <button
          type="button"
          className="impact-trigger"
          onClick={() => setImpactOpen(true)}
          onPointerEnter={() => {
            const image = new Image();
            image.src = namCatTienImpact.backgroundImage;
          }}
        >
          <span>Xem tác động của vé</span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </section>

      <ImpactJourney
        open={impactOpen}
        onOpenChange={setImpactOpen}
        data={namCatTienImpact}
      />
    </main>
  );
}
