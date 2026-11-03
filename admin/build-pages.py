"""Generate static admin pages from shared Stisla/Meridian components."""
from pathlib import Path
import re
import sys
from html import escape
ROOT=Path(__file__).resolve().parent
targets=set(sys.argv[1:])
ref=(ROOT/'customers.html').read_text()
icons=[i for i in re.findall(r'<svg\b.*?</svg\s*>',ref,re.S) if '</head>' not in i and len(i)<6000]
def find_icon(fragment):
 return next((i for i in icons if fragment in i),icons[0])
ICON={'search':find_icon('11.5'),'delete':find_icon('20.5 6'),'menu':find_icon('M20 7'),'add':find_icon('M15 12'),'course':find_icon('M2 6.5'),'category':find_icon('M2 6.5'),'banner':find_icon('M2 6.5')}
ICON['add']='<svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M15 12h-3m0 0H9m3 0V9m0 3v3"/></g></svg>'
ICON['external']='<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
for name in ['course', 'banner']:
 icon=(ROOT/f'templates/icon-{name}.svg').read_text()
 ICON[name]=icon.replace('<svg ', '<svg aria-hidden="true" ',1)
# Render the shared sidebar before app-shell initialization on every generated page.
shell=(ROOT/'templates/shell.html').read_text()
shell=re.sub(r'<aside class="sidebar sidebar--lg sidebar--app".*?</aside>', '<script src="assets/js/sidebar.js"></script>', shell, count=1, flags=re.S)
a=shell.index('<header class="navbar">')
shell=shell[:a]+f'''<header class="navbar"><button type="button" class="button button--ghost button--neutral button--icon-only button--flush-start" data-stisla-app-shell-toggle="auto" aria-label="Toggle navigation">{ICON['menu']}</button><span class="text-sm text-muted-foreground">Industrial Training</span><div class="flex items-center gap-2 ms-auto"><a class="button button--ghost button--neutral button--sm hidden lg:flex" href="../index.html" target="_blank" rel="noopener noreferrer" aria-label="View website (opens in a new tab)">View website{ICON['external']}</a><div class="menu"><button type="button" class="button button--ghost button--neutral" data-stisla-menu-trigger="adminAccount" aria-label="Open admin account menu" aria-haspopup="menu" aria-expanded="false" aria-controls="adminAccount"><span class="avatar avatar--sm avatar--circle" aria-hidden="true"><span class="avatar__fallback">A</span></span><span>Admin</span><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m19 9-7 6-7-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="menu__popup w-48" id="adminAccount" data-stisla-menu data-state="closed" role="menu"><a class="menu__item" role="menuitem" href="password.html">Change password</a><a class="menu__item" href="login.html" role="menuitem">Sign out</a></div></div></div></header>'''
shell=shell.replace('/meridian/','/admin/').replace('Meridian','Yokogawa')
# Keep original footer attribution; links to template-only settings are removed.
shell=re.sub(r'<footer class="sidebar__footer">.*?</footer>','<footer class="sidebar__footer"><p class="text-xs text-muted-foreground">Yokogawa · Admin Preview</p></footer>',shell,flags=re.S)
def field(name,label,kind='text',help='',required=False):
 attrs=f'id="{name}" name="{name}"'+(' required' if required else '')
 if kind=='textarea':control=f'<textarea class="textarea" {attrs} rows="4"></textarea>'
 elif kind=='category':control=f'<select class="select" {attrs} data-category-options><option value="">Select a category</option></select>'
 elif kind=='course-status':control=f'<select class="select" {attrs}><option>Draft</option><option>Published</option></select>'
 elif kind=='category-status':control=f'<select class="select" {attrs}><option>Unpublished</option><option>Published</option></select>'
 else:
  extra=''
  if kind=='image':kind='file';extra='accept="image/jpeg,image/png,image/webp"'
  elif kind=='pdf':kind='file';extra='accept="application/pdf,.pdf"'
  elif kind=='media':kind='file';extra='accept="image/jpeg,image/png,image/webp,video/mp4"'
  elif kind=='password':extra='autocomplete="new-password"'
  elif kind=='number':extra='min="1"'
  control=f'<input class="input" type="{kind}" {attrs} {extra}>'
 return f'<div class="field"><label class="field__label" for="{name}">{label}{" *" if required else ""}</label>{control}<p class="field__description" id="{name}-help">{help}</p><p class="field__description text-danger" id="{name}-error" data-error="{name}" role="alert"></p></div>'
def card(title,body):return f'<section class="card"><div class="card__header"><h2 class="card__title">{title}</h2></div><div class="card__body">{body}</div></section>'
def button(url,label):return f'<a class="button button--primary" href="{url}">{ICON["add"]}{label}</a>'
def dialog():return f'''<div class="dialog dialog--sm" id="deleteRecord" data-stisla-dialog data-state="closed" role="alertdialog" aria-modal="true" aria-labelledby="deleteTitle" aria-describedby="deleteDescription" aria-hidden="true" tabindex="-1"><div class="dialog__backdrop" data-stisla-dialog-dismiss></div><div class="dialog__panel"><div class="dialog__content"><div class="dialog__body text-center pt-6"><span class="icon-box icon-box--danger icon-box--circle icon-box--lg mb-3">{ICON['delete']}</span><h2 class="dialog__title" id="deleteTitle">Delete this item?</h2><p class="text-muted-foreground" id="deleteDescription">Delete <span data-slot="name"></span> from this preview? This cannot be undone during this session.</p></div><div class="dialog__footer justify-center"><button type="button" class="button button--ghost button--neutral" data-stisla-dialog-dismiss>Cancel</button><button type="button" class="button button--danger" data-confirm-delete data-stisla-dialog-dismiss>Delete item</button></div></div></div></div>'''
def write(name,title,description,body,action='',mode=''):
 s=shell
 html=f'''<!doctype html><html lang="en" data-theme="light"><head><link rel="icon" href="../asset/yokogawa-favicon.ico" type="image/x-icon"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{title} · Yokogawa Admin</title><script>(function(){{var t=localStorage.getItem('stisla-theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}})();</script><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="assets/css/style.css"></head><body data-admin-page="{mode}">{s}<div class="page content"><div class="content__container"><header class="page__header"><div class="page__headline"><h1 class="page__title" data-page-title>{title}</h1><p class="page__description">{description}</p></div><div class="page__action">{action}</div></header><div class="page__body"><p class="text-sm" role="status" id="feedback"></p>{body}</div></div></div>{dialog()}</main></div><script type="module" src="https://cdn.jsdelivr.net/npm/@stisla/vanilla@3/dist/stisla.js"></script><script src="assets/js/app-shell.js"></script><script src="assets/js/theme.js"></script><script src="assets/js/table-select.js"></script><script src="assets/js/admin-demo.js"></script></body></html>'''
 if mode in ['courses','course-form','category-form']:
  html=html.replace('</head>', '<link rel="stylesheet" href="assets/css/meridian/course-management.css"></head>')
 if mode=='courses':
  toast='''<div class="toast-region toast-region--bottom-end" aria-live="polite" aria-atomic="true"><div class="toast toast--success" id="reorder-toast" data-state="closed"><span class="toast__icon" aria-hidden="true">✓</span><div class="toast__content"><p class="toast__header">Order updated</p><p class="toast__body" id="reorder-toast-message"></p></div><button class="toast__close" type="button" id="reorder-toast-close" aria-label="Dismiss notification">×</button></div></div>'''
  html=html.replace('</body>', toast+'</body>')
 if not targets or name in targets: (ROOT/name).write_text(html)
def table(mode):
 course=mode=='courses'
 search=f'''<div class="input-group ms-auto w-full md:w-60 mb-4 md:mb-0"><span class="input-group__text">{ICON['search']}</span><input type="search" class="input" name="q" id="search" aria-label="Search {'courses' if course else 'categories'}" placeholder="{'CENTUM VP' if course else 'Safety'}"></div>'''
 filters='<div class="flex flex-wrap items-center gap-2">'
 if course:filters+='<div class="w-48"><select class="select" id="categoryFilter" aria-label="Filter by category" data-category-options><option value="">All categories</option></select></div>'
 filters+='<div class="w-48"><select class="select" id="statusFilter" aria-label="Filter by status"><option value="">All statuses</option>'+''.join(f'<option>{s}</option>' for s in (['Draft','Published'] if course else ['Unpublished','Published']))+'</select></div>'
 if course: filters+='<label class="flex items-center gap-2 text-sm" for="course_favorites_filter_switch"><input class="switch" type="checkbox" role="switch" id="course_favorites_filter_switch" aria-controls="records"><span>Popular only</span></label>'
 filters+='<button class="button button--ghost button--neutral button--sm" id="resetFilters">Clear filters</button></div>'
 pagination='<nav class="ms-auto" aria-label="Course pages" id="coursePagination"><ul class="pagination" id="paginationButtons"></ul></nav>' if course else ''
 headings=['Course','Category','Duration','Status','Actions'] if course else ['Category','Courses','Status','Actions']
 head=''.join(f'<th scope="col"'+(' class="text-end"' if h in ['Courses','Actions'] else '')+f'>{h}</th>' for h in headings)
 return f'<section class="page__section"><div class="card"><div class="card__header flex-wrap">{filters}{search}</div><div class="table-responsive"><table class="table table--hover table--align-middle"><thead class="table__head--alt"><tr>{head}</tr></thead><tbody id="records"></tbody></table></div><div class="empty-state" id="emptyState" hidden><h2 class="empty-state__title" id="emptyTitle">No matching results</h2><p class="empty-state__text">Try another search or clear the filters.</p><button type="button" class="button button--neutral" id="emptyReset">Clear filters</button></div><div class="card__footer"><span class="text-sm text-muted-foreground" id="resultCount" role="status"></span>{pagination}</div></div></section>'
course_tabs='''<div class="tabs" id="course-tabs">
<div class="tabs__list" role="tablist" aria-label="Course views">
<button class="tabs__trigger" type="button" role="tab" id="all-courses-tab" aria-controls="all-courses-panel" data-state="active" aria-selected="true" tabindex="0">All courses</button>
<button class="tabs__trigger" type="button" role="tab" id="popular-courses-tab" aria-controls="popular-courses-panel" data-state="inactive" aria-selected="false" tabindex="-1">Popular courses</button>
</div>
<section class="tabs__panel" id="all-courses-panel" role="tabpanel" aria-labelledby="all-courses-tab" data-state="active">'''+table('courses')+'''</section>
<section class="tabs__panel" id="popular-courses-panel" role="tabpanel" aria-labelledby="popular-courses-tab" data-state="inactive" hidden>
<div class="card">
<div class="card__header"><h2 class="card__title" id="popular-order-title">Homepage order</h2></div>
<div class="card__body">
<div class="alert alert--info">
<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 10.5v5m0-7h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
<p class="alert__title">Popular course order</p>
<p class="alert__description"><span id="popular-count" role="status"></span> For a balanced layout, aim for at least 4 courses in multiples of 2. Drag the handle or use ↑/↓ to reorder. Changes save automatically.</p>
</div>
<p class="text-sm" id="popular-warning" hidden></p>
<p class="sr-only" id="popular-drag-help">Drag the handle to reorder. With a keyboard, focus the handle and press Arrow Up or Arrow Down. Press Escape to cancel a drag. Changes are saved immediately for this preview session.</p>
</div>
<div class="table-responsive" id="popular-table"><table class="table table--hover table--align-middle" aria-labelledby="popular-order-title">
<thead class="table__head--alt"><tr><th scope="col"><span class="sr-only">Reorder</span></th><th scope="col">Position</th><th scope="col">Course</th><th scope="col">Category</th><th scope="col">Status</th><th scope="col">Homepage visibility</th></tr></thead>
<tbody id="popular-records"></tbody></table></div>
<div class="empty-state" id="popular-empty" hidden><h2 class="empty-state__title">No popular courses selected</h2><p class="empty-state__text">Select courses using the star buttons in All courses.</p><button class="button button--neutral" type="button" id="popular-browse">Go to All courses</button></div>
</div></section></div>'''
write('index.html','Courses','Manage course details, training schedules, and publication status.',course_tabs,button('course-form.html','Add course'),'courses')
write('categories.html','Course categories','Organize courses into categories and control which categories appear on the website.',table('categories'),button('category-form.html','Add category'),'categories')
def actions(back,label):return f'<div class="sticky-bar"><span class="text-xs text-muted-foreground me-auto">* Required field</span><a class="button button--neutral" href="{back}">Cancel</a><button type="submit" class="button button--primary">{label}</button></div>'
info=field('name','Course name',required=True)+field('code','Course code')+field('slug','Slug',help='Generated automatically from the course name. You can edit it using lowercase letters, numbers, and hyphens. Keep it unique.',required=True)+field('description','Short description','textarea',required=True)
details=''.join(field(n,l,k) for n,l,k in [('objective','Course objectives','textarea'),('participants','Participants','textarea'),('prerequisite','Prerequisites','textarea'),('duration','Duration','text'),('classSize','Maximum class size','number'),('fee','Course fee','text')])
def icon_field(label):
 return '''<div class="field"><label class="field__label" for="icon">'''+label+'''</label><input class="input" type="file" id="icon" name="icon" accept="image/svg+xml,image/png,.svg,.png" aria-describedby="icon-help icon-error"><p class="field__description" id="icon-help">Optional. Choose an SVG or PNG up to 2 MB. Replace the file to change the icon, or remove it to use the default.</p><div class="flex items-center gap-3"><img id="icon-preview" src="../asset/category-settings.svg" width="32" height="32" alt="Icon preview"><span class="text-sm" id="icon-filename">Default icon</span></div><button type="button" class="button button--ghost button--neutral" id="icon-remove" hidden>Remove icon</button><p class="field__description text-danger" id="icon-error" data-error="icon" role="alert"></p><p class="sr-only" id="icon-status" role="status"></p></div>'''
media=icon_field('Course icon')+field('thumbnail','Thumbnail','image','Upload a JPG, PNG, or WebP image up to 2 MB. The thumbnail is displayed on the homepage when this course is set as a popular course.')+field('pdf','Training schedule PDF','pdf','Optional. Upload a PDF up to 10 MB.')+'<p class="field__description" id="existingFiles"></p>'
content='''<p class="field__description" id="course_content_help">Add the training topics for each day, in order. Enter one topic per line. Upload the schedule PDF in Media and schedule.</p><div id="course_content_days" class="flex flex-col gap-3"></div><p class="field__description" id="course_content_empty">No days added. Add a day to enter course content.</p><p class="field__description text-danger" id="days-error" data-error="days" role="alert"></p><button type="button" class="button button--neutral" id="course_content_add_button">Add day</button><p class="sr-only" id="course_content_status" role="status"></p><template id="course_content_day_template"><div class="field" data-course-day><div class="flex flex-wrap items-center justify-between gap-2"><h3 class="font-medium" data-day-heading></h3><button type="button" class="button button--ghost button--danger" data-remove-day>Remove day</button></div><label class="field__label" data-day-label>Topics *</label><textarea class="textarea" rows="5" data-day-topics required aria-describedby="course_content_help days-error"></textarea></div></template>'''
seo=field('metaTitle','Meta title')+field('metaDescription','Meta description','textarea','Leave blank to use the short description.')
publish=field('category','Category','category',required=True)+field('status','Status','course-status')+'<p class="field__description" id="visibilityNote">A course appears on the website only when both the course and its category are Published.</p>'
form=f'<form class="order-form" data-demo-form="course"><div class="grid grid-cols-12 gap-4"><div class="col-span-12 lg:col-span-8"><div class="flex flex-col gap-3">{card("Course information",info)}{card("Training details",details)}{card("Course content",content)}{card("SEO metadata",seo)}</div></div><div class="col-span-12 lg:col-span-4"><div class="flex flex-col gap-3">{card("Publication",publish)}{card("Media and schedule",media)}</div></div></div>{actions("index.html","Save course")}</form>'
write('course-form.html','Add course','Add course details, then save as Draft or Published.',form,mode='course-form')
course_count='<div class="field"><span class="field__label" id="category-count-label">Course count</span><p id="categoryCourseCount" class="text-sm" aria-labelledby="category-count-label">0 courses</p><p class="field__description">Calculated automatically from all courses in this category, including Draft courses.</p></div>'
form='<form class="order-form" data-demo-form="category"><div class="grid grid-cols-12 gap-4"><div class="col-span-12 lg:col-span-8">'+card('Category information',field('name','Category name',required=True)+icon_field('Category icon')+course_count)+'</div><div class="col-span-12 lg:col-span-4">'+card('Publication',field('status','Status','category-status')+'<p class="field__description">Unpublished categories and their courses are hidden from the website.</p>')+'</div></div>'+actions('categories.html','Save category')+'</form>'
write('category-form.html','Add category','Set the category name and publication status.',form,mode='category-form')
banner=field('media','Banner media','media','Upload a JPG, PNG, or WebP image up to 2 MB, or an MP4 up to 20 MB. The preview uses a 16:9 aspect ratio.')+field('title','Heading',required=True)+field('description','Description','textarea',required=True)+field('button','Primary button label',required=True)+field('url','Primary button URL',help='Use an http/https URL or a path starting with /.',required=True)+field('secondaryButton','Secondary button label',required=True)+field('secondaryUrl','Secondary button URL',help='Use an http/https URL or a path starting with /.',required=True)
preview='<img src="../asset/hero-photo.jpg" alt="Banner media preview" id="bannerImage" class="w-full rounded-sm object-cover" style="aspect-ratio: 16 / 9" hidden><video id="bannerVideo" class="w-full rounded-sm object-cover" style="aspect-ratio: 16 / 9" src="../asset/hero-background.mp4" poster="../asset/hero-photo.jpg" preload="metadata" controls muted playsinline></video><h3 class="font-semibold" id="previewTitle"></h3><p class="text-sm text-muted-foreground" id="previewDescription"></p><a class="button button--primary" id="previewLink" href="../courses.html">View courses</a>'
preview=preview.replace('<a class="button button--primary" id="previewLink"', '<div class="flex flex-wrap gap-2"><a class="button button--primary" id="previewLink"')+'<a class="button button--neutral" id="previewSecondaryLink" href="../index.html#contact">Ask Our Team</a></div>'
write('banner.html','Home banner','Update the media, heading, description, and buttons on the homepage banner.',f'<form class="order-form" data-demo-form="banner"><div class="grid grid-cols-12 gap-4"><div class="col-span-12 lg:col-span-8">{card("Banner content",banner)}</div><div class="col-span-12 lg:col-span-4">{card("Banner preview",preview)}</div></div>{actions("index.html","Save banner")}</form>',mode='banner')
password=field('oldPassword','Current password','password',required=True)+field('newPassword','New password','password','Use at least 8 characters.',True)+field('confirmPassword','Confirm new password','password',required=True)+'<p class="field__description">For this preview, use demo1234 as the current password.</p>'
write('password.html','Change password','Enter your current password and choose a new password.',f'<form class="order-form" data-demo-form="password"><div class="grid grid-cols-12 gap-4"><div class="col-span-12 lg:col-span-8">{card("Account security",password)}</div></div>{actions("index.html","Change password")}</form>',mode='password')
# Reuse the entire original authentication layout, including input-group SVGs.
l=(ROOT/'templates/login.html').read_text().replace('lang="en"','lang="en"').replace('/meridian/','/admin/').replace('Meridian','Yokogawa')
l=l.replace('Welcome back','Sign in to admin').replace('Sign in to your Yokogawa dashboard.','Manage Yokogawa Industrial Training content.').replace('Sign in\n','Sign in\n')
l=re.sub(r'<a href="/admin/forgot.html".*?</a>','',l,flags=re.S)
l=re.sub(r'<div class="field__item">.*?</div>','',l,flags=re.S)
l=re.sub(r'<p class="text-center text-sm text-muted-foreground">.*?</p>','<p class="text-center text-sm text-muted-foreground">Preview only. Sign in with admin@example.com and demo1234. Live accounts are created by the developer.</p>',l,flags=re.S)
l=l.replace('<form class="flex flex-col gap-4">','<form class="flex flex-col gap-4" data-demo-form="login"><p id="feedback" role="alert" class="text-sm text-danger"></p>')
l=re.sub(r'<a href="/admin/" class="button button--primary button--block button--lg"(.*?)</a>',r'<button type="submit" class="button button--primary button--block button--lg"\1</button>',l,flags=re.S)
l=l.replace('id="loginEmail"','id="loginEmail" name="email" required').replace('id="loginPassword"','id="loginPassword" name="password" required')
l=re.sub(r'<h2 class="auth__pitch-title">.*?</h2>', '<h2 class="auth__pitch-title">Training content,<span>in one place.</span></h2>', l, flags=re.S)
l=re.sub(r'<p class="auth__pitch-lede">.*?</p>', '<p class="auth__pitch-lede">Keep course details up to date, organize training categories, and manage the homepage banner.</p>', l, flags=re.S)
l=l.replace('you@meridian.com','name@example.com')
l=l.replace('</body>','<script src="assets/js/admin-demo.js"></script></body>')
if not targets or 'login.html' in targets: (ROOT/'login.html').write_text(l)
print('Generated selected admin pages using shared Stisla components.' if targets else 'Generated 7 admin pages using shared Stisla components.')
