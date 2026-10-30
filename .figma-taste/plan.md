# Plan: Yokogawa Indonesia · FAQ

## Run
- Figma file: https://www.figma.com/design/Dy5CHxzaYc40en39cFvdah/Yokogawa
- Target: node 213:290. Inspect before writing; preserve existing work and use an empty linked wrapper if available.
- Homepage reference: node 2415:233 in the same file.
- Frames: Desktop 1440 and Mobile 360, required by PRD FR01. Support layout reflow through 1920 per FR02. Do not replace these with skill defaults 1920/390.
- Design options: 1; content mode: draft FAQ copy for client validation, individually annotated as dummy.
- Source of scope: spec/yokogawa-indonesia-website_prd.md, read in full during planning.
- Existing system: unknown; build must inspect homepage, components, variables and styles before creating. Reuse the client's system; do not build duplicate foundations.
- Follow figma-taste build workflow. Planning deliberately makes no Figma calls; reference measurements remain unverified until build.

## Inventories
- Subject inventory: Yokogawa Indonesia; industrial training; engineers; operators; procurement; course categories; course duration; course costs; training schedule PDF; course enquiries; company enquiries.
- Site inventory from PRD: Home, Courses, Course Detail, FAQ, Contact Us, 404; admin login, categories, courses, Home banner, change password. This task draws FAQ only.
- Repeated units: existing navbar, CTA Contact and footer must remain reusable component instances. Inspect their main components and responsive variants. Reuse existing button, heading, breadcrumb and accordion components where available.
- FAQ states: collapsed, expanded, keyboard focus. Navbar desktop and mobile menu closed/open. Document Tab/Shift+Tab, Enter/Space activation, visible focus and expanded semantics.
- Other system states in PRD: loading, empty, error, form validation, submitting, success, SMTP failure preserving inputs. Do not insert unrelated form states into FAQ.

## Argument
- Navbar (user mandated): familiar access to Home, Courses, FAQ, Contact Us using the existing component.
- Banner (PRD mandated): establish the FAQ context using the homepage's typography and brand treatment.
- Accordion (PRD mandated): answer common course-information questions in a concise scan; one expanded item demonstrates the answer treatment.
- CTA Contact (user and PRD mandated): route unresolved questions to Contact Us using the existing CTA instance.
- Footer (user mandated): reuse the existing footer and verified contact information.

## Direction and deal
- Direction: extend the homepage exactly in type styles, colors, spacing, page container, borders and button treatment. No new competing art direction.
- Idea: course-information questions become a practical index leading engineers, operators and procurement to the existing catalogue and contact route.
- Composition pinned by brief/PRD: existing navbar → banner → accordion → existing CTA Contact → existing footer. Random composition selection is unnecessary for this prescribed utility page and must not change its required structure.
- Match source homepage grid where present, adapting to 1440/360. Do not invent measurements before inspecting.

## References
- Homepage: https://www.figma.com/design/Dy5CHxzaYc40en39cFvdah/Yokogawa?node-id=2415-233
- Adopt actual text styles, variable bindings, content margins, header geometry, section rhythm, CTA and footer components after inspecting in build.
- Target: https://www.figma.com/design/Dy5CHxzaYc40en39cFvdah/Yokogawa?node-id=213-290
- No live reference website provided. No unverified assertions about homepage appearance.

## Design system decisions
- CONFIG: reuse existing system; foundations creation is not authorized by need until inspection proves missing essentials. No guessed palettes or font names.
- Verify actual font families/styles from homepage and load them before text mutations.
- Reuse navbar, CTA and footer through createInstance or cloning existing instances retaining mainComponent links. Choose existing desktop/mobile variants. Do not flatten or detach.
- Accordion: reuse if available; otherwise add a named reusable component with Closed, Open and Focus states using existing design tokens/text styles. Use auto layout and wrapping text. Icon must distinguish expanded/collapsed states.
- Preserve homepage navigation scope if compliant: Home, Courses, FAQ, Contact Us. PRD excludes English and language switcher, Products & Solutions, Industries, News, Careers, online training registration, payments and visitor accounts. If shared source includes these, use safe instance overrides or document the conflict; do not modify homepage silently.
- Accessibility annotations: accordion headers are buttons, aria-expanded and aria-controls; logical headings; visible focus, keyboard operation; touch targets at least 44px; ensure AA contrast. Figma design is a specification, not proof of working browser keyboard semantics.
- Implementation handoff: FAQ static content, FAQPage structured data mirrors visible answers, BreadcrumbList if breadcrumb is present, one H1. No FAQ admin management.

## Copy deck
All new FAQ prose below is draft/dummy pending Yokogawa approval; annotate layers accordingly. Existing approved navbar/CTA/footer content remains unchanged except safe required language/navigation overrides.

Banner:
- H1: Pertanyaan yang Sering Diajukan
- Supporting: Temukan informasi tentang course, jadwal training, dan cara menghubungi Yokogawa Indonesia.

Accordion:
1. Bagaimana cara menemukan course yang sesuai?
   Buka halaman Courses untuk mencari course berdasarkan nama atau memilih kategori training. Pilih course untuk melihat informasi selengkapnya.
2. Informasi apa yang tersedia pada halaman detail course?
   Anda dapat melihat informasi course, durasi, dan biaya. Jadwal training dalam format PDF tersedia untuk course yang memiliki dokumen tersebut.
3. Di mana saya dapat mengunduh jadwal training?
   Buka halaman detail course dan pilih Download Training Schedule jika tombol tersebut tersedia. Jika jadwal belum tersedia, hubungi kami melalui halaman Contact Us.
4. Bagaimana cara menanyakan informasi tentang course tertentu?
   Gunakan formulir kontak pada halaman detail course. Pertanyaan Anda akan dikirim bersama nama dan tautan course agar tim kami mengetahui course yang Anda maksud.
5. Bagaimana cara menghubungi Yokogawa untuk pertanyaan umum?
   Buka halaman Contact Us untuk melihat informasi kontak dan mengirim pesan melalui formulir yang tersedia.
6. Apakah saya perlu membuat akun untuk melihat informasi training?
   Informasi course dan jadwal training dapat diakses tanpa login.

CTA:
- Reuse existing CTA wording and contact destination if appropriate. If a FAQ-specific instance override is needed: “Masih ada pertanyaan?” / “Sampaikan pertanyaan Anda melalui halaman Contact Us.” / “Hubungi Kami”.
- Do not promise response time, certification, cancellation policies, quotas, custom training, online enrolment or payment options without approved sources.

## Images
- No new image required for this utility page. Reuse existing approved banner treatment if appropriate; avoid importing homepage hero imagery merely to fill space.

## Dummy content
- Banner headline/supporting sentence, six FAQ questions and answers, optional FAQ CTA text overrides are draft content for approval. Layer names and annotations must identify dummy content without inserting placeholder warnings into the page prose.
- No invented addresses, email, phone, statistics, customer logos or testimonials.

## Build verification and delivery
- Inspect target and homepage first, inventory component sources and existing design system; confirm account when ambiguous.
- Build desktop 1440 and mobile 360 using auto layout and existing tokens/styles.
- Check all reused navbar/CTA/footer nodes remain instances linked to their main components.
- Show expanded and collapsed accordion treatment and focused header, plus mobile navigation state in a nearby specification board if needed.
- Verify no text overflow, clipping or overlaps; audit variable/style reuse and meaningful layer names; screenshot both final frames and inspect visually.
- Report final Figma frame links, component source IDs, remaining draft content and limits of design-only accessibility verification.
