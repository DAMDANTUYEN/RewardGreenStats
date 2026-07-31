"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Camera,
  CheckCircle2,
  Compass,
  Footprints,
  Leaf,
  MapPin,
  Maximize2,
  Quote,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";

import Navbar from "@/components/Navbar";

import styles from "./ourStory.module.css";

const STORY_IMAGE_DIMENSIONS = [
  null,
  [1069, 597], [1600, 739], [1600, 1200], [1020, 1020], [739, 1600],
  [1600, 720], [956, 1276], [426, 889], [426, 889], [958, 628],
  [720, 1600], [1600, 720], [1200, 1600], [1600, 1200], [1200, 1600],
  [1200, 1600], [960, 1280], [960, 1280], [1600, 1203], [1080, 805],
  [1080, 806], [1080, 804], [1156, 760], [1600, 1085], [1200, 1600],
  [1600, 1200], [1200, 1600], [740, 1600], [1600, 720], [1080, 1411],
  [868, 1282], [1600, 1200], [1600, 900], [1600, 900], [1080, 803],
  [1600, 1200], [1600, 1200], [1203, 1600], [1600, 739], [1200, 1600],
  [1600, 1244], [1600, 1202], [1200, 1600], [1453, 640],
];

const StoryLightboxContext = createContext(() => {});

const CHAPTERS = [
  ["01", "Bắt đầu lại", "bat-dau"],
  ["02", "Trên trang giấy", "tren-trang-giay"],
  ["03", "GreenStats", "greenstats"],
  ["04", "Bước ra ngoài", "buoc-ra-ngoai"],
  ["05", "Ba điểm đến", "ba-diem-den"],
  ["06", "Những người", "nhung-nguoi"],
  ["07", "Ngoài báo cáo", "ngoai-bao-cao"],
  ["08", "Những ngày cuối", "nhung-ngay-cuoi"],
  ["09", "Điều giữ lại", "dieu-giu-lai"],
];

const DESTINATIONS = [
  {
    id: "vam-sat",
    number: "01",
    name: "Vàm Sát",
    kicker: "Nơi chúng tôi bắt đầu đi",
    location: "Cần Giờ · TP. Hồ Chí Minh",
    accent: "#35d69f",
    paragraphs: [
      "Vàm Sát là điểm đến đầu tiên trong hành trình thực địa của chúng tôi. Vì ở gần, cả nhóm đã quay lại nơi này nhiều lần.",
      "Mỗi lần là một trải nghiệm khác: những con đường giữa rừng ngập mặn, cầu dây, dòng nước yên tĩnh và cả hoạt động câu cá sấu khiến chúng tôi vừa hồi hộp vừa thích thú.",
      "Đây không phải chuyến đi xa nhất hay khó nhất, nhưng lại là nơi đánh dấu thời điểm nghiên cứu thực sự bước ra khỏi trang giấy.",
    ],
    photos: [
      [15, "Cả nhóm trên cầu dây giữa rừng Vàm Sát"],
      [16, "Một khoảnh khắc quan sát hệ sinh thái"],
      [17, "Chuyến đi xuyên rừng ngập mặn"],
      [18, "Gặp gỡ du khách trên hành trình khảo sát"],
    ],
  },
  {
    id: "nam-cat-tien",
    number: "02",
    name: "Nam Cát Tiên",
    kicker: "Những câu chuyện ở giữa rừng",
    location: "Đồng Nai",
    accent: "#8ade6f",
    paragraphs: [
      "Nam Cát Tiên là những chuyến xe bắt đầu từ sáng sớm, những con đường dài và cảm giác mình trở nên thật nhỏ giữa thiên nhiên.",
      "Nhật An là người chở cả nhóm từ thành phố đến Đồng Nai. Chuyến đi khá xa, nhưng cũng là nơi chúng tôi có nhiều kỷ niệm vui nhất nên vẫn quay lại thêm nhiều lần.",
      "Ở đây, chúng tôi gặp nhiều du khách nước ngoài với những góc nhìn mới về du lịch xanh và một chú kiểm lâm vui tính, người đã biến chuyến khảo sát thành một buổi khám phá rừng đầy câu chuyện.",
      "Nam Cát Tiên giúp chúng tôi hiểu rằng bảo tồn không chỉ nằm trong tài liệu. Nó hiện diện trong từng cánh rừng và trong những người đang âm thầm gìn giữ nơi này.",
    ],
    photos: [
      [19, "Trên những cung đường xanh của Nam Cát Tiên"],
      [20, "Một buổi sáng bắt đầu giữa rừng"],
      [21, "Cả nhóm cùng người bạn đồng hành ở Nam Cát Tiên"],
      [22, "Một lần trở lại khác của nhóm"],
      [23, "Kỷ niệm của GreenStats được lưu lại trên báo"],
      [24, "Lắng nghe câu chuyện về dòng nước và cánh rừng"],
    ],
  },
  {
    id: "nui-chua",
    number: "03",
    name: "Núi Chúa",
    kicker: "Nơi đẹp nhất cũng là nơi thử thách nhất",
    location: "Ninh Thuận",
    accent: "#e8bd68",
    paragraphs: [
      "Núi Chúa mang một vẻ đẹp rất khác: biển xanh, núi đá, nắng gắt và những vùng rừng khô hạn. Đây cũng là chuyến đi khó khăn nhất.",
      "Chúng tôi may mắn được gia đình của Nguyệt Như cho ở nhờ. Những bữa ăn giản dị, sự quan tâm của cô chú và không khí gia đình khiến chuyến đi trở nên ấm áp hơn rất nhiều.",
      "Ở Ninh Thuận, chúng tôi còn gặp Inra Sara — người đã chia sẻ nhiều câu chuyện và những bài học mà cả nhóm vẫn còn nhớ.",
      "Núi Chúa giúp chúng tôi hiểu rằng đôi khi, điều quý giá nhất của một chuyến nghiên cứu không nằm ở dữ liệu thu được, mà ở sự tử tế đã nhận trên đường đi.",
    ],
    photos: [
      [25, "Một chặng đường thực địa ở Núi Chúa"],
      [26, "Cả nhóm tại điểm đến ở Ninh Thuận"],
      [27, "Bữa cơm giản dị và ấm áp"],
      [28, "Những món quà từ vùng đất mới"],
      [29, "Một bữa ăn sau ngày dài khảo sát"],
    ],
  },
];

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.78, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function StoryImage({
  number,
  alt,
  caption,
  className = "",
  sizes = "(max-width: 768px) 92vw, 45vw",
  priority = false,
}) {
  const openLightbox = useContext(StoryLightboxContext);

  return (
    <motion.figure
      className={`${styles.storyImage} ${className}`}
      initial={{ opacity: 0, scale: 0.96, y: 28 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        className={styles.imageButton}
        onClick={() => openLightbox({ number, alt, caption })}
        aria-label={`Phóng to ảnh: ${alt}`}
      >
        <Image
          src={`/our-story/${number}.webp`}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
        />
        <span className={styles.imageZoomHint} aria-hidden="true">
          <Maximize2 size={16} />
        </span>
      </button>
      {caption && <figcaption>{caption}</figcaption>}
    </motion.figure>
  );
}

function StoryLightbox({ image, onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const [width, height] = STORY_IMAGE_DIMENSIONS[image.number];

  return (
    <motion.div
      className={styles.lightbox}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Xem ảnh lớn: ${image.alt}`}
      onClick={onClose}
    >
      <button type="button" className={styles.lightboxClose} onClick={onClose} aria-label="Đóng ảnh lớn">
        <X size={22} />
      </button>
      <motion.div
        className={styles.lightboxContent}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={`/our-story/${image.number}.webp`}
          alt={image.alt}
          width={width}
          height={height}
          sizes="100vw"
          priority
        />
        <p>{image.caption || image.alt}</p>
      </motion.div>
    </motion.div>
  );
}

function ChapterHeading({ number, eyebrow, title, intro, align = "left" }) {
  return (
    <Reveal className={`${styles.chapterHeading} ${styles[`align${align}`]}`}>
      <div className={styles.chapterMeta}>
        <span>{number}</span>
        <i />
        <p>{eyebrow}</p>
      </div>
      <h2>{title}</h2>
      {intro && <p className={styles.chapterIntro}>{intro}</p>}
    </Reveal>
  );
}

function DestinationStory({ destination }) {
  return (
    <article
      id={destination.id}
      className={styles.destinationStory}
      style={{ "--story-accent": destination.accent }}
    >
      <div className={styles.destinationCopy}>
        <Reveal>
          <span className={styles.destinationNumber}>{destination.number}</span>
          <p className={styles.destinationLocation}>
            <MapPin size={14} aria-hidden="true" />
            {destination.location}
          </p>
          <h3>{destination.name}</h3>
          <strong>{destination.kicker}</strong>
          <div className={styles.destinationBody}>
            {destination.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </div>

      <div className={styles.destinationGallery}>
        {destination.photos.map(([number, alt], index) => (
          <StoryImage
            key={number}
            number={number}
            alt={alt}
            caption={index === 0 ? destination.name : undefined}
            className={index === 0 ? styles.destinationHeroPhoto : ""}
            sizes="(max-width: 900px) 92vw, 54vw"
          />
        ))}
      </div>
    </article>
  );
}

export default function OurStoryPage() {
  const heroRef = useRef(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 150]);
  const heroScale = useTransform(heroProgress, [0, 1], [1.02, 1.12]);

  return (
    <StoryLightboxContext.Provider value={setLightboxImage}>
    <div className={styles.storyPage}>
      <motion.div
        className={styles.readingProgress}
        style={{ scaleX: smoothProgress }}
        aria-hidden="true"
      />
      <div className={styles.ambient} aria-hidden="true" />

      <Navbar active="story" />

      <nav className={styles.chapterRail} aria-label="Các chương của câu chuyện">
        {CHAPTERS.map(([number, label, id]) => (
          <a key={id} href={`#${id}`} title={label}>
            <span>{number}</span>
            <i />
          </a>
        ))}
      </nav>

      <main>
        <section ref={heroRef} className={styles.hero} aria-labelledby="story-title">
          <motion.div
            className={styles.heroImage}
            style={{
              y: reduceMotion ? 0 : heroY,
              scale: reduceMotion ? 1.02 : heroScale,
            }}
          >
            <Image
              src="/our-story/21.webp"
              alt="Nhóm GreenStats trong một chuyến đi thực địa giữa rừng"
              fill
              priority
              sizes="100vw"
            />
          </motion.div>
          <div className={styles.heroVeil} aria-hidden="true" />
          <div className={styles.heroGrid} aria-hidden="true" />

          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.heroEyebrow}>
              <Sparkles size={15} aria-hidden="true" />
              Field notes · 2025—2026
            </div>
            <h1 id="story-title">
              Our
              <span>Story</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Một hành trình được viết bằng những lần bắt đầu lại,
              <br /> những chuyến đi và rất nhiều kỷ niệm.
            </p>

            <div className={styles.heroStats}>
              <div><strong>09</strong><span>Chương</span></div>
              <div><strong>03</strong><span>Điểm đến</span></div>
              <div><strong>01</strong><span>Lần bắt đầu lại</span></div>
            </div>

            <a className={styles.scrollCue} href="#bat-dau">
              <span>Đọc câu chuyện</span>
              <ArrowDown size={16} aria-hidden="true" />
            </a>
          </motion.div>

          <p className={styles.heroSideNote}>GreenStats · Research journey</p>
        </section>

        <section id="bat-dau" className={`${styles.chapter} ${styles.openingChapter}`}>
          <ChapterHeading
            number="01"
            eyebrow="Một lần bắt đầu lại"
            title={<>Chúng tôi đã từng <em>không đi đến đích.</em></>}
            intro="Câu chuyện này không bắt đầu từ một chiến thắng. Nó bắt đầu từ một lần chưa thành công — và quyết định thử thêm một lần nữa."
          />

          <div className={styles.openingLayout}>
            <Reveal className={styles.proseBlock}>
              <p>
                Một năm trước, chúng tôi từng thực hiện một đề tài nghiên cứu khoa học về gốm Bàu Trúc. Chúng tôi đã dành nhiều thời gian, công sức và kỳ vọng cho nó, nhưng cuối cùng đề tài không vượt qua vòng cấp trường.
              </p>
              <p>
                Có một chút thất vọng. Có một chút tiếc nuối. Nhưng thay vì dừng lại, chúng tôi quyết định thử thêm một lần nữa.
              </p>
              <p>
                Năm nay, hành trình có thêm Huyền — một thành viên mới, một nguồn năng lượng mới và cũng là người đã giúp chúng tôi giữ tinh thần trong rất nhiều giai đoạn khó khăn.
              </p>
              <p>
                Chúng tôi bắt đầu lại, không phải vì thất bại trước đó không còn quan trọng, mà vì nó khiến chúng tôi muốn làm tốt hơn.
              </p>
            </Reveal>

            <div className={styles.openingCollage}>
              <StoryImage number={1} alt="Nhóm trong hành trình nghiên cứu trước đây" className={styles.openingPhotoOne} />
              <StoryImage number={2} alt="Hai thành viên trong những ngày đầu" className={styles.openingPhotoTwo} />
              <StoryImage number={3} alt="Nhóm tại tháp Chăm ở Ninh Thuận" className={styles.openingPhotoThree} />
            </div>
          </div>

          <Reveal className={styles.pullQuote}>
            <Quote aria-hidden="true" />
            <blockquote>
              Có những hành trình chỉ thực sự bắt đầu sau một lần chưa đi đến đích.
            </blockquote>
          </Reveal>
        </section>

        <section id="tren-trang-giay" className={`${styles.chapter} ${styles.paperChapter}`}>
          <ChapterHeading
            number="02"
            eyebrow="Những ngày đầu"
            title={<>Từ một đề tài <em>trên giấy.</em></>}
            intro="Một chủ đề, một vài khái niệm và rất nhiều câu hỏi chưa có lời giải."
          />

          <div className={styles.paperTimeline}>
            {[
              [BookOpen, "Đặt đúng câu hỏi", "Green Marketing là gì? Vì sao có người sẵn sàng chi trả cho một chuyến đi xanh, trong khi người khác lại hoài nghi?"],
              [UsersRound, "Tranh luận để rõ hơn", "Có những buổi cả nhóm ngồi hàng giờ chỉ để sửa một câu hỏi và những phần tưởng hoàn thành vẫn phải làm lại từ đầu."],
              [CheckCircle2, "Học cách kiên nhẫn", "Nghiên cứu không phải là tìm câu trả lời thật nhanh, mà là kiên nhẫn với những điều chưa rõ."],
            ].map(([Icon, title, text], index) => (
              <Reveal key={title} className={styles.timelineCard} delay={index * 0.08}>
                <span><Icon size={19} aria-hidden="true" /></span>
                <small>0{index + 1}</small>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>

          <div className={styles.paperMosaic}>
            <StoryImage number={4} alt="Màn hình làm việc với dữ liệu nghiên cứu" caption="Những lần sửa lại từ đầu" className={styles.paperWide} />
            <StoryImage number={5} alt="Một bảng dữ liệu nghiên cứu trên máy tính" />
            <StoryImage number={6} alt="Buổi làm việc và trao đổi nghiên cứu" />
            <StoryImage number={7} alt="Nhóm tại một buổi trình bày học thuật" caption="Từ những ý tưởng rời rạc" />
          </div>
        </section>

        <section id="greenstats" className={`${styles.chapter} ${styles.digitalChapter}`}>
          <div className={styles.digitalGlow} aria-hidden="true" />
          <ChapterHeading
            number="03"
            eyebrow="Một ý tưởng nhỏ xuất hiện"
            title={<>Rồi GreenStats <em>được hình thành.</em></>}
            intro="Chúng tôi tự hỏi: làm thế nào để một bảng khảo sát dài và khá học thuật trở nên gần gũi hơn?"
          />

          <div className={styles.digitalLayout}>
            <Reveal className={styles.proseBlock}>
              <p>
                Nhật An đã giúp chúng tôi biến bảng khảo sát thành một trải nghiệm trực tuyến có hình ảnh, thông tin về điểm đến và cơ chế vòng quay nhận quà.
              </p>
              <p>
                Việc khảo sát không còn chỉ là gửi một đường link rồi chờ phản hồi. Nhiều người cảm thấy tò mò, thích thú và sẵn sàng tham gia hơn. Kết quả thu được vượt xa những gì chúng tôi từng kỳ vọng.
              </p>
              <p>
                GreenStats không chỉ là một website. Nó là dấu mốc cho thấy một ý tưởng nhỏ có thể thay đổi cách chúng tôi tiếp cận người tham gia nghiên cứu.
              </p>
              <div className={styles.digitalTag}>
                <Leaf size={17} aria-hidden="true" />
                From survey to experience
              </div>
            </Reveal>

            <div className={styles.deviceStage}>
              <StoryImage number={8} alt="Giao diện GreenStats trên điện thoại" className={styles.phoneOne} sizes="220px" />
              <StoryImage number={9} alt="Giao diện vòng quay GreenStats" className={styles.phoneTwo} sizes="220px" />
            </div>
          </div>

          <div className={styles.digitalFootnotes}>
            <StoryImage number={10} alt="Bài đăng giới thiệu phiếu khảo sát GreenStats" caption="Một bảng hỏi học thuật trở thành lời mời khám phá" className={styles.digitalArticle} />
            <StoryImage number={11} alt="Khoảnh khắc hậu trường khi phát triển GreenStats" caption="Những đêm chạy deadline" />
          </div>
        </section>

        <section id="buoc-ra-ngoai" className={`${styles.chapter} ${styles.fieldChapter}`}>
          <ChapterHeading
            number="04"
            eyebrow="Bước ra khỏi màn hình"
            title={<>Rồi chúng tôi <em>bắt đầu đi.</em></>}
            intro="Có một thời điểm, nghiên cứu không còn nằm trong tài liệu, file Excel hay những buổi họp nữa."
          />

          <div className={styles.fieldHero}>
            <StoryImage number={12} alt="Nhóm GreenStats trên một chuyến đi khảo sát" caption="Một ngày khảo sát bắt đầu từ rất sớm" sizes="100vw" />
            <Reveal className={styles.fieldOverlayCopy}>
              <Footprints size={23} aria-hidden="true" />
              <p>
                Trong balô là điện thoại, phiếu khảo sát, sổ ghi chép, nước uống — và cả sự hồi hộp.
              </p>
            </Reveal>
          </div>

          <div className={styles.fieldGrid}>
            <Reveal className={styles.fieldNarrative}>
              <p>
                Có người vui vẻ dừng lại trò chuyện. Có người mỉm cười rồi từ chối. Có những ngày chúng tôi nhận được rất nhiều phản hồi, cũng có những ngày đi thật xa nhưng kết quả lại không như mong đợi.
              </p>
              <p>
                Gần như cuối tuần nào có thể sắp xếp, cả nhóm lại kéo nhau đi. Chính những ngày ấy khiến chúng tôi hiểu rằng phía sau mỗi con số là một con người, một trải nghiệm và một cách nhìn riêng.
              </p>
            </Reveal>
            <StoryImage number={13} alt="Một buổi đi phát khảo sát thực địa" caption="Có những câu trả lời đến từ một cuộc trò chuyện ngắn" />
            <StoryImage number={14} alt="Hai thành viên trong chuyến đi cuối tuần" caption="Cuối tuần rảnh là lại đi" />
          </div>
        </section>

        <section id="ba-diem-den" className={`${styles.chapter} ${styles.destinationsChapter}`}>
          <ChapterHeading
            number="05"
            eyebrow="Ba chương ký ức"
            title={<>Ba điểm đến.<br /><em>Ba sắc xanh.</em></>}
            intro="Mỗi nơi cho chúng tôi một kiểu thử thách, một cách nhìn mới và những kỷ niệm hoàn toàn khác nhau."
          />

          <div className={styles.destinationRoute} aria-label="Lộ trình ba điểm đến">
            {DESTINATIONS.map((destination, index) => (
              <span key={destination.id} style={{ "--route-color": destination.accent }}>
                <i>{index + 1}</i>
                {destination.name}
              </span>
            ))}
          </div>

          {DESTINATIONS.map((destination) => (
            <DestinationStory key={destination.id} destination={destination} />
          ))}
        </section>

        <section id="nhung-nguoi" className={`${styles.chapter} ${styles.peopleChapter}`}>
          <ChapterHeading
            number="06"
            eyebrow="People we met"
            title={<>Mỗi cuộc gặp đều để lại <em>một điều gì đó.</em></>}
            intro="Có người đồng hành suốt hành trình. Có người chỉ xuất hiện trong một chuyến đi hoặc một cuộc trò chuyện ngắn. Nhưng mỗi người đều để lại một phần trong câu chuyện này."
          />

          <article className={styles.mentorFeature}>
            <StoryImage number={30} alt="Cô Vân cùng nhóm GreenStats" className={styles.mentorPhoto} sizes="(max-width: 800px) 92vw, 38vw" />
            <Reveal className={styles.mentorCopy}>
              <span>Người đồng hành xuyên suốt</span>
              <h3>Cô Vân</h3>
              <p>
                Từ những ngày đề tài vẫn còn là các ý tưởng chưa rõ ràng, cô đã giúp chúng tôi định hướng vấn đề và biến những suy nghĩ rời rạc thành một nghiên cứu có cấu trúc.
              </p>
              <p>
                Cô không chỉ hỗ trợ về chuyên môn mà còn luôn động viên cả nhóm trong những giai đoạn mệt mỏi và áp lực nhất.
              </p>
              <blockquote>
                Cảm ơn cô vì đã không chỉ hướng dẫn một đề tài, mà còn đồng hành cùng chúng tôi trong cả một hành trình trưởng thành.
              </blockquote>
            </Reveal>
          </article>

          <div className={styles.peopleGrid}>
            <Reveal className={styles.personCard}>
              <StoryImage number={31} alt="Chân dung Nhật An" className={styles.personPortrait} sizes="300px" />
              <div><span>Code · Drive · Support</span><h3>Nhật An</h3><p>Lập trình viên, tài xế và người nhiều lần thức cùng cả nhóm để chạy deadline.</p></div>
            </Reveal>
            <Reveal className={styles.personCard} delay={0.06}>
              <StoryImage number={32} alt="Nhóm GreenStats cùng chú kiểm lâm Nam Cát Tiên" className={styles.personLandscape} />
              <div><span>Stories of the forest</span><h3>Chú kiểm lâm</h3><p>Người biến chuyến khảo sát Nam Cát Tiên thành một buổi khám phá rừng đầy câu chuyện.</p></div>
            </Reveal>
            <Reveal className={`${styles.personCard} ${styles.familyCard}`} delay={0.12}>
              <div className={styles.familyPhotos}>
                <StoryImage number={33} alt="Gia đình đã đón tiếp nhóm tại Ninh Thuận" />
                <StoryImage number={34} alt="Một bữa cơm và khoảnh khắc gia đình tại Ninh Thuận" />
              </div>
              <div><span>Warm welcome</span><h3>Những gia đình ở Ninh Thuận</h3><p>Những người đã cho chúng tôi chỗ ở, những bữa ăn và cảm giác được chào đón.</p></div>
            </Reveal>
            <Reveal className={`${styles.personCard} ${styles.travelerCard}`} delay={0.18}>
              <div className={styles.familyPhotos}>
                <StoryImage number={35} alt="Nhóm cùng những người tham gia hành trình" />
                <StoryImage number={36} alt="Du khách bên dòng nước trong chuyến khảo sát" />
              </div>
              <div><span>Every answer matters</span><h3>Những du khách đã tham gia</h3><p>Những người đã dành vài phút để từng con số trong nghiên cứu trở nên có ý nghĩa.</p></div>
            </Reveal>
          </div>
        </section>

        <section id="ngoai-bao-cao" className={`${styles.chapter} ${styles.offRecordChapter}`}>
          <ChapterHeading
            number="07"
            eyebrow="Off the record"
            title={<>Có những điều không thể đưa vào <em>bảng số liệu.</em></>}
            intro="Báo cáo có thể ghi số lượng bảng hỏi, hệ số và kết quả kiểm định. Nhưng báo cáo không thể kể hết những lần chúng tôi đợi nhau."
          />

          <Reveal className={styles.offRecordCopy}>
            <p>
              Những chuyến xe dài, những bữa ăn vội, những cuộc tranh luận và những đêm cùng nhau sửa bài. Cảm giác khi một người lạ đồng ý dành thời gian trả lời khảo sát; khi một kết quả cuối cùng trở nên rõ ràng; hay khi cả nhóm nhận ra mình đã đi xa hơn rất nhiều so với ngày đầu tiên.
            </p>
            <p>
              Có lúc chúng tôi mệt. Có lúc không đồng ý với nhau. Có lúc cảm thấy mình đã làm sai hoàn toàn. Nhưng cũng chính những khoảnh khắc ấy khiến hành trình này trở nên đáng nhớ.
            </p>
          </Reveal>

          <div className={styles.filmStrip}>
            {[
              [37, "Một bữa ăn cùng nhau"],
              [38, "Những phút chờ đợi trên đường"],
              [39, "Khoảnh khắc vui sau một ngày dài"],
              [40, "Một khung hình nhỏ được giữ lại"],
            ].map(([number, alt], index) => (
              <div key={number} className={styles.filmCell}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <StoryImage number={number} alt={alt} />
              </div>
            ))}
          </div>

          <Reveal className={styles.pullQuote}>
            <Camera aria-hidden="true" />
            <blockquote>
              Những hình ảnh không xuất hiện trong báo cáo, nhưng lại là điều chúng tôi nhớ nhất.
            </blockquote>
          </Reveal>
        </section>

        <section id="nhung-ngay-cuoi" className={`${styles.chapter} ${styles.finalDaysChapter}`}>
          <ChapterHeading
            number="08"
            eyebrow="Khi mọi mảnh ghép dần hoàn chỉnh"
            title={<>Những ngày cuối là <em>những ngày dài nhất.</em></>}
            intro="Chúng tôi kiểm tra dữ liệu, chỉnh sửa nội dung, hoàn thiện hình ảnh và vẫn tiếp tục phát hiện những điều cần sửa."
          />

          <div className={styles.finalDaysGrid}>
            <StoryImage number={41} alt="Nhóm trong những ngày hoàn thiện nghiên cứu" />
            <StoryImage number={42} alt="Hai thành viên trong ngày nghiệm thu" />
            <StoryImage number={43} alt="Nhóm GreenStats trong ngày trình bày kết quả" />
          </div>

          <Reveal className={styles.finalDaysCopy}>
            <p>
              Có lúc cảm giác công việc sẽ không bao giờ kết thúc. Nhưng từng trang dần hoàn chỉnh, từng kết quả dần có ý nghĩa và những ý tưởng rời rạc từ ngày đầu cuối cùng cũng kết nối lại với nhau.
            </p>
            <p>
              Rồi ngày nghiệm thu đến. Khi đứng trước hội đồng và nhìn lại công trình đã hoàn thành, chúng tôi không chỉ thấy một bài nghiên cứu. Chúng tôi thấy những chuyến xe, những buổi làm việc, những cuộc trò chuyện và phiên bản của chính mình ở từng chặng đường.
            </p>
          </Reveal>

          <StoryImage number={44} alt="Tập thể trong ngày nghiệm thu nghiên cứu khoa học" caption="Ngày những mảnh ghép cùng đứng trong một khung hình" className={styles.finalGroupPhoto} sizes="100vw" />
        </section>

        <section id="dieu-giu-lai" className={styles.closingChapter}>
          <div className={styles.closingHalo} aria-hidden="true" />
          <Reveal className={styles.closingContent}>
            <span className={styles.closingNumber}>09 · Điều chúng tôi giữ lại</span>
            <h2>
              Sau cùng,
              <br /> không chỉ là <em>kết quả.</em>
            </h2>
            <p>
              Chúng tôi bắt đầu hành trình này với mong muốn hoàn thành một nghiên cứu khoa học. Nhưng khi hành trình dần khép lại, điều quý giá nhất còn là cách chúng tôi học được sự kiên nhẫn, cách lắng nghe nhau, cách tiếp tục khi mọi thứ không diễn ra như kế hoạch — và cách nhìn thiên nhiên bằng một sự trân trọng sâu sắc hơn.
            </p>
            <p>
              GreenStats, bài nghiên cứu và cuốn proposal là những sản phẩm còn lại. Phía sau chúng là rất nhiều con người, cảm xúc và kỷ niệm mà chúng tôi sẽ nhớ lâu hơn bất kỳ con số nào.
            </p>
            <div className={styles.closingStatement}>
              <span>Đây là câu chuyện về một nghiên cứu.</span>
              <strong>Nhưng cũng là câu chuyện về tuổi trẻ của chúng tôi.</strong>
            </div>
            <Link href="/explore" className={styles.closingLink}>
              Tiếp tục khám phá
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </Reveal>
          <div className={styles.closingMark} aria-hidden="true">
            <Compass />
          </div>
        </section>
      </main>

      <footer className={styles.storyFooter}>
        <span>GreenStats · Our Story</span>
        <p>Được viết từ những chuyến đi và những lần bắt đầu lại.</p>
      </footer>

      <AnimatePresence>
        {lightboxImage && (
          <StoryLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
        )}
      </AnimatePresence>
    </div>
    </StoryLightboxContext.Provider>
  );
}
