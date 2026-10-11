# منابع، پوشش بررسی و فهرست فریم‌ها

بازگشت به [راهنمای طراحی](README.md). تاریخ برداشت: **۲۰۲۶-۱۰-۱۱**.

## منبع و روش

[فایل Assessments — v3.0.0، بخش Profiles](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-1214) روی صفحهٔ `🔘  Assessments` با شناسهٔ `3:1018` بررسی شد. حوزهٔ این فهرست همان بخش معرفی‌شدهٔ کاربر است؛ صفحات محصول، PDF، کاور و بخش‌های دیگر فایل در این استخراج قواعد نیم‌رخ ادغام نشده‌اند.

metadata کل این زیرشاخه شامل **۳۰٬۷۷۹ گره** خوانده شد. فهرست زیر **۱۳۶ فریم در اندازهٔ صفحه** را ثبت می‌کند: **۱۳۴ فریم نیم‌رخ در ۹ خانواده، یک فریم NEO خارج از سکشن خانواده، و یک قالب صفحه**. این عدد تعداد آزمون یکتا نیست: صفحات چندگانه، نسخه‌ها و دو فریم هم‌مکان Penn هم شمرده شده‌اند. قطعات کامپوننت کنار صفحات جزو این شمارش نیستند. نسخهٔ ماشینی فهرست: [figma-inventory.json](figma-inventory.json).

طبق دستور کاربر، پایین‌تر بودن در **همان سکشن** اولویت تازگی است. هر جدول از پایین به بالا مرتب شده؛ yهای مساوی ترتیب زمانی ندارند. تاریخ انتشار، شمارهٔ ID و ترتیب لایه‌ها به‌جای این دستور استفاده نشده‌اند. کاربر نبودِ کامنت/یادداشت مکمل را تأیید کرده است.

تصویرهای کامل سکشن‌ها برای مرور ترکیب‌بندی‌ها و تصاویر مستقل برای نمونه‌های جدید و چند استثنا دیده شدند. هندسه، رنگ، typography و effects منتخب مستقیماً از Plugin API خوانده شدند. اعداد قدیمی که فقط در مرور کلی دیده شده‌اند به‌عنوان اندازهٔ دقیق ثبت نشده‌اند. رفتارِ دیده‌نشده از PNG ثابت استنتاج نشده است.

## اصلاح صریح طراح پس از بررسی خروجی

در **۲۰۲۶-۱۰-۱۱**، کاربر پس از مقایسهٔ نسخهٔ قبل و بازطراحی RSSS93 پنج پیش‌فرض تازه تعیین کرد. منبع این موارد، دستور مستقیم کاربر در بازبینی «مقیاس کشمکش‌های مذهبی و معنوی» است، نه استنتاج از فریم فیگما: حذف توضیحات اختیاری و مرکزدهی نمودار، حذف تیترهای زائد، اجرای زبان واقعی میله‌های رنگیِ خانوادهٔ مرجع، نام عمومی «نمره کل» و حذف صفرهای انتهایی اعشار بدون کاهش دقت. متن اجرایی و استثناها با شناسه‌های **VIS-25 تا VIS-29** در [راهنمای اصلی](README.md) ثبت شده‌اند.

این پیش‌فرض‌ها در کارهای بعدی بر توصیه‌های استنتاجی ناسازگار و متن‌های اختیاری نمونه‌های تاریخی مقدم‌اند. دستور مربوط به RSSS93 شامل حذف هر دو باکس توضیح و جایگزینی خط‌ونقطه با میلهٔ رنگی است؛ الزام میله‌ای‌شدن همهٔ خانواده‌ها یا تغییر جمعیِ فایل‌های آزمون‌های قدیمی از آن نتیجه نمی‌شود. نمونه‌های BAT/JSS فقط مرجع بصری‌اند و دامنه، طبقه‌بندی و اعتبار آن‌ها به RSSS93 منتقل نمی‌شود.

## سطح پوشش

| بخش | تعداد فریم بررسی‌شده | دامنهٔ بررسی | تصاویر منتخب نگهداری‌شده |
|---|---:|---|---|
| Bar | 65 | BAT، JSS، Strong چهارصفحه‌ای، NEO و نمونه‌های تاریخی | [BAT](examples/figma/bar-bat.png)، [JSS](examples/figma/bar-jss.png)، [Strong 1](examples/figma/bar-strong-1.png)، [Strong 4](examples/figma/bar-strong-4.png) |
| Column | 18 | میلون۴ چهارصفحه‌ای، BSSI، BDI و MOCI قدیمی | [MCMI4 1](examples/figma/column-mcmi4-1.png)، [MCMI4 2](examples/figma/column-mcmi4-2.png)، [MCMI4 4](examples/figma/column-mcmi4-4.png)، [BSSI](examples/figma/column-bssi.png) |
| Circle & Pie | 15 | خسروی و خودشناسی؛ رها، انعطاف و IUS برای مقایسه | [خسروی](examples/figma/circle-god-khosravi.png)، [خودشناسی](examples/figma/circle-self-knowledge.png) |
| Radar | 8 | گلاسر و آلپورت؛ هالند و انریچ برای تفاوت نوع | [گلاسر](examples/figma/radar-glasser.png)، [آلپورت](examples/figma/radar-allport.png) |
| Gauges | 4 | مسئولیت‌پذیری؛ مقایسه با سه نمونهٔ بالاتر | [مسئولیت‌پذیری](examples/figma/gauge-responsibility.png) |
| CheckList | 8 | شخصیت۲۰۲۵ و هالند حوزه صفحه۳ | [شخصیت۲۰۲۵](examples/figma/checklist-personality2025.png)، [هالند](examples/figma/checklist-holland.png) |
| XY & Bubble | 5 | NEOهای کلاسیک و مقایسه با ریون/SAFE/FACES | [NEO کلاسیک](examples/figma/xy-neo-classic.png) |
| Mix | 9 | دو صفحهٔ انتهایی تعامل همسران؛ مقایسهٔ ساختار فریم‌ها | [تعامل همسران](examples/figma/mix-couples.png) |
| Heat Maps | 2 | اسپنس؛ مقایسه با احساس گناه | [اسپنس](examples/figma/heat-spence.png) |
| Templates | 1 | اندازه و رنگ قاب، Header و Sidebar از خود لایه‌ها | [قالب فیگما](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/?node-id=3-16116) |
| بیرون سکشن | 1 | NEO اضافی: metadata و typography؛ مبنای تغییر پیش‌فرض خانواده نیست | [فریم](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/?node-id=5978-215205) |

این مجموعه ۱۸ PNG منتخب از فیگما دارد. تصاویر شامل نوشته‌ها و داده‌های نمونهٔ خود طراحی هستند؛ آن‌ها fixture نمره‌دهی نیستند. نمونه‌های چندصفحه‌ایِ نگهداری‌شده هرکدام چیدمان مستقلی نشان می‌دهند؛ صفحات هم‌الگو، نمونه‌های قدیمی و نماهای کلی سکشن‌ها فقط از طریق لینک‌های فیگمای همین فهرست قابل مراجعه‌اند. تصاویر موقت موتور محلی حذف شده‌اند؛ [سابقهٔ بازطراحی‌ها و رندرهای بررسی‌شده](examples/recent-redesigns.md) به‌صورت متنی باقی است. تمام تصاویر مرجع صفحات کامل‌اند؛ کادر مشترک صفحه را داخل HBS کپی نکنید.

## ابهام‌های ثبت‌شده

- دو فریم Penn در Circle دقیقاً در یک مکان‌اند؛ y و visible بودن به‌تنهایی تعیین نمی‌کند کدام تأیید نهایی طراح است. هیچ‌کدام مرجع پیش‌فرض جدید این راهنما نیست.
- پایین‌ترین فریم یک خانواده الزاماً از پایین‌ترین فریم خانوادهٔ دیگر جدیدتر نیست؛ مثال Gauges با Circle یک استاندارد ضخامت مشترک نمی‌سازد.
- کامپوننت‌ها و لایه‌های hidden، نمونه‌های آزمایشی یا چند حالت روی یک بوم باید با تصویر نهایی تطبیق داده شوند.
- آستانهٔ داخل/بیرون متن در بسیاری از PNGها، رفتار نبود هشدار، overflow متن و تعداد دلایل از تصویر ثابت معلوم نیست. مقدارهای دقیقِ معلوم از کد اخیر جدا در مثال گیت ثبت شده‌اند.
- در بعضی نمونه‌ها Chart نام بخشی از محتواست و All پوشش کامل را دارد؛ مفهوم raw در راهنما به محتوای مجاز اشاره دارد، نه نام یک گره.
- داده و عنوان‌های متفاوتِ نسخه‌ها مجوز تغییر معنا در بازطراحی بصری نیستند.

## شواهد گیت

[سه بازطراحی و اصلاحاتشان](examples/recent-redesigns.md): ISI `dc85393`، AIS `42ec6b7`، PSQI `3b2d8ab` و هشدار `29a9258`، به‌علاوه اصلاح مسیر گیج `9fd6b26`. نسخهٔ۴.۸۹ شامل BAT و اصلاح نمایش اعتبار PSQI توسط نویسندگان دیگر است؛ کل بازهٔ نسخه‌ها به‌عنوان تغییر صرفاً بصریِ یک طراح معرفی نشده است.

## فهرست کامل — از پایین به بالا

### Mix

[سکشن 3:5168](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-5168)؛ تعداد فریم صفحه: 9. مختصات نسبت به این سکشن است.

| فریم | node | x | y |
|---|---|---:|---:|
| پرسشنامه تعامل همسران - نسخه بانوان - ۲ | [3:7388](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-7388) | 80 | 3448 |
| پرسشنامه تعامل همسران - نسخه آقایان - ۲ | [3:7495](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-7495) | 1243 | 3448 |
| پرسشنامه تعامل همسران - نسخه بانوان - ۱ | [3:7024](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-7024) | 80 | 2606 |
| پرسشنامه تعامل همسران - نسخه آقایان - ۱ | [3:7602](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-7602) | 1243 | 2606 |
| پرسشنامه پیش از ازدواج - فرم ب (۲) | [3:6571](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-6571) | 80 | 1764 |
| پرسشنامه پیش از ازدواج - فرم ب (۳) | [3:6770](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-6770) | 1243 | 1764 |
| پرسشنامه پیش از ازدواج - فرم الف | [3:5669](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-5669) | 80 | 922 |
| پرسشنامه پیش از ازدواج - فرم ب (۱) | [3:6391](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-6391) | 1243 | 922 |
| پرسشنامه رغبت‌سنج تحصیلی - شغلی | [3:5169](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-5169) | 80 | 80 |

### CheckList

[سکشن 3:7810](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-7810)؛ تعداد فریم صفحه: 8. مختصات نسبت به این سکشن است.

| فریم | node | x | y |
|---|---|---:|---:|
| پرسشنامه شخصیت ۲۰۲۵ - فرم بلند - جدول رده‌بندی | [6026:192563](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=6026-192563) | 80 | 4290 |
| پرسشنامه رغبت‌سنج تحصیلی - شغلی هالند - ویرایش حوزه - صفحه ۳ | [5961:168513](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5961-168513) | 80 | 3448 |
| چک لیست نشانه‌های استرس پس از سانحه (PCL-5) - بر اساس DSM-5 | [3407:110120](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3407-110120) | 80 | 2606 |
| پرسشنامه یل‌براون وسواس - مرتب‌شده بر اساس سوالات | [3:8473](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-8473) | 80 | 1764 |
| پرسشنامه یل‌براون وسواس - مرتب‌شده بر اساس پاسخ‌ها | [3:9077](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-9077) | 1243 | 1764 |
| پرسشنامه افسردگی کودکان و نوجوانان - جان‌بزرگی | [3:8170](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-8170) | 80 | 922 |
| پرسشنامه ارزیابی سلامت روانی کودکان - 1 | [3:7811](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-7811) | 80 | 80 |
| پرسشنامه ارزیابی سلامت روانی کودکان - 2 | [3:7994](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-7994) | 1243 | 80 |

### XY & Bubble

[سکشن 3:9697](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-9697)؛ تعداد فریم صفحه: 5. مختصات نسبت به این سکشن است.

| فریم | node | x | y |
|---|---|---:|---:|
| آزمون شخصیت نئو - فرم بلند (PI-R) - گروسی فرشی - کلاسیک | [5978:206438](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5978-206438) | 80 | 4016 |
| آزمون شخصیت نئو - فرم بلند (PI-R) - حق‌شناس - کلاسیک | [5970:175784](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5970-175784) | 80 | 3174 |
| آزمون ریون استاندارد | [3533:115713](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3533-115713) | 80 | 1764 |
| پرسشنامه FACES | [3:9840](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-9840) | 80 | 922 |
| پرسشنامه SAFE | [3:9698](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-9698) | 80 | 80 |

### Gauges

[سکشن 3:10196](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-10196)؛ تعداد فریم صفحه: 4. مختصات نسبت به این سکشن است.

| فریم | node | x | y |
|---|---|---:|---:|
| مقیاس نگرش مسئولیت‌پذیری | [3:10197](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-10197) | 80 | 2606 |
| پرسشنامه ارزیابی اضطراب شینان | [3:10241](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-10241) | 80 | 1764 |
| پرسشنامه ارزیابی سطح کلی اضطراب | [3:10224](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-10224) | 80 | 922 |
| پرسشنامه تشخیص کانرز - نسخه والدین  | [3:10209](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-10209) | 80 | 80 |

### Circle & Pie

[سکشن 3:10273](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-10273)؛ تعداد فریم صفحه: 15. مختصات نسبت به این سکشن است.

| فریم | node | x | y |
|---|---|---:|---:|
| پرسشنامه تصور از خدا (خسروی) | [5406:147205](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5406-147205) | 80 | 11026 |
| مقياس خودشناسی انسجامی | [5405:146147](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5405-146147) | 80 | 10184 |
| پرسشنامه انعطاف - نفوذناپذیری | [3360:103757](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3360-103757) | 80 | 9342 |
| پرسشنامه رها - آشکارسازی | [3210:106751](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3210-106751) | 80 | 8500 |
| پرسشنامه سبک‌های دلبستگی بزرگسالان هازن و شیور | [2941:103562](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=2941-103562) | 80 | 7658 |
| پرسشنامه سبک‌های فرزندپروری والدین | [736:85811](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=736-85811) | 80 | 6816 |
| پرسشنامه وسواس مذهبی اخلاقی پن | [527:83235](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=527-83235) | 80 | 5974 |
| پرسشنامه وسواس مذهبی اخلاقی پن | [2941:102258](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=2941-102258) | 80 | 5974 |
| پرسشنامه شخصیت آیسنک - نسخه بزرگسالان | [3:10685](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-10685) | 80 | 5132 |
| پرسشنامه خودپنداره - خداپنداره جان‌بزرگی | [3:10633](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-10633) | 80 | 4290 |
| پرسشنامه رضایت از زندگی داینر | [3:10623](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-10623) | 80 | 3448 |
| پرسشنامه نگرانی پن | [3:10580](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-10580) | 80 | 2606 |
| پرسشنامه سنجش عقل میردریکوندی | [3:10387](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-10387) | 80 | 1764 |
| پرسشتامه حالت - رگه اضطراب اسپیلبرگر (STAI) | [3:10320](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-10320) | 80 | 922 |
| پرسشنامه عدم تحمل بلاتکلیفی (IUS) | [3:10274](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-10274) | 80 | 80 |

### Radar

[سکشن 3:10935](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-10935)؛ تعداد فریم صفحه: 8. مختصات نسبت به این سکشن است.

| فریم | node | x | y |
|---|---|---:|---:|
| نیازهای اساسی گلاسر | [2922:103373](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=2922-103373) | 80 | 5132 |
| پرسشنامه بررسی ارزش‌های آلپورت | [1745:90856](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=1745-90856) | 80 | 4290 |
| پرسشنامه رغبت‌سنج تحصیلی - شغلی هالند - صفحه ۲ | [985:90927](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=985-90927) | 80 | 3448 |
| پرسشنامه رغبت‌سنج تحصیلی - شغلی هالند - ویرایش حوزه - صفحه ۲ | [5908:294891](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5908-294891) | 1243 | 3448 |
| پرسشنامه رضایت زناشویی انریچ 47 سوالی | [3:11132](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-11132) | 80 | 2606 |
| پرسشنامه سبك زندگي ارتقا دهنده سلامت | [3:11075](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-11075) | 80 | 1764 |
| پرسشنامه عملکرد خانواده 53 و 60 سوالی | [3:10989](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-10989) | 80 | 922 |
| پرسشنامه دلبستگی کولینز و رید | [3:10936](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-10936) | 80 | 80 |

### Column

[سکشن 3:11243](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-11243)؛ تعداد فریم صفحه: 18. مختصات نسبت به این سکشن است.

| فریم | node | x | y |
|---|---|---:|---:|
| پرسشنامه بالینی میلون ۴ - صفحه ۴ - شاخص‌های هشدار دهنده | [7559:229735](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=7559-229735) | 80 | 14394 |
| پرسشنامه بالینی میلون ۴ - صفحه ۳ - گراسمن ۲ | [7469:222511](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=7469-222511) | 80 | 13552 |
| پرسشنامه بالینی میلون ۴ - صفحه ۲ - گراسمن ۱ | [7438:219126](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=7438-219126) | 80 | 12710 |
| پرسشنامه بالینی میلون ۴ - صفحه ۱ | [6131:229009](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=6131-229009) | 80 | 11868 |
| پرسشنامه افکار خودکشی بک (BSSI) | [5405:143397](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5405-143397) | 80 | 11026 |
| پرسشنامه پایبندی مذهبی | [4725:122367](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=4725-122367) | 80 | 10184 |
| آزمون افسردگی بک (BDI) - فرم کوتاه | [4379:116713](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=4379-116713) | 80 | 9342 |
| آزمون افسردگی بک (BDI) - 2 | [4378:112086](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=4378-112086) | 80 | 8500 |
| آزمون افسردگی بک (BDI) - 1 | [5069:129333](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5069-129333) | 80 | 7658 |
| چک لیست نشانه‌های استرس پس از سانحه (PCL-5) | [3396:104826](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3396-104826) | 80 | 6816 |
| سیاهه رفتاری کودکان مدرسه‌ای آخنباخ (CBCL) - فرم والدین - مقایس‌های سندرمی | [3202:103869](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3202-103869) | 80 | 5974 |
| پرسشنامه سلامت عمومی (GHQ28) | [3:11244](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-11244) | 80 | 5132 |
| پرسشنامه ۱۶ عاملی شخصیت کتل (16pf) - ویرایش طلیعه سلامت | [3:12012](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-12012) | 80 | 4290 |
| پرسشنامه ۱۶ عاملی شخصیت کتل (16pf) | [3:11800](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-11800) | 80 | 3448 |
| پرسشنامه مهارت‌های ارتباطی جرابک | [3:11618](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-11618) | 80 | 2606 |
| پرسشنامه عملکرد تحصیلی فام و تیلر (درتاج) | [3:11555](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-11555) | 80 | 1764 |
| پرسشنامه حالات هویت بنیون و آدامز | [3:11437](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-11437) | 80 | 922 |
| پرسشنامه وسواس فکری - علمی مادزلی (MOCI) | [3:11309](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-11309) | 80 | 80 |

### Bar

[سکشن 3:12557](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-12557)؛ تعداد فریم صفحه: 65. مختصات نسبت به این سکشن است.

| فریم | node | x | y |
|---|---|---:|---:|
|  ابزار ارزیابی فرسودگی شغلی (BAT) | [8072:262980](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=8072-262980) | 80 | 33752 |
| پرسشنامه رضایت شغلی اسپکتور (JSS) | [8071:183988](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=8071-183988) | 80 | 32910 |
| پرسشنامه رغبت‌سنج استرانگ - ۱ | [7756:236677](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=7756-236677) | 80 | 32068 |
| پرسشنامه رغبت‌سنج استرانگ - ۲ | [7849:241908](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=7849-241908) | 1243 | 32068 |
| پرسشنامه رغبت‌سنج استرانگ - ۳ | [7856:283263](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=7856-283263) | 2406 | 32068 |
| پرسشنامه رغبت‌سنج استرانگ - ۴ - مقیاس‌های سبک شخصی | [7856:285112](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=7856-285112) | 3569 | 32068 |
| آزمون شخصیت نئو - فرم کوتاه (FFI) - گروسی فرشی | [5890:289567](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5890-289567) | 80 | 31226 |
| آزمون شخصیت نئو - فرم بلند (PI-R) - گروسی فرشی - نسخه بانوان - ۱ | [7555:215096](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=7555-215096) | 80 | 30384 |
| آزمون شخصیت نئو - فرم بلند (PI-R) - گروسی فرشی - نسخه بانوان - ۲ | [7555:214633](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=7555-214633) | 1251 | 30384 |
| آزمون شخصیت نئو - فرم بلند (PI-R) - گروسی فرشی - نسخه بانوان - ۳ | [7555:214906](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=7555-214906) | 2422 | 30384 |
| آزمون شخصیت نئو - فرم بلند (PI-R) - گروسی فرشی - نسخه آقایان - ۱ | [5850:135470](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5850-135470) | 80 | 29542 |
| آزمون شخصیت نئو - فرم بلند (PI-R) - گروسی فرشی - نسخه آقایان - ۲ | [5869:137187](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5869-137187) | 1251 | 29542 |
| آزمون شخصیت نئو - فرم بلند (PI-R) - گروسی فرشی - نسخه آقایان - ۳ | [5889:163903](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5889-163903) | 2422 | 29542 |
| آزمون شخصیت نئو - فرم بلند (PI-R) - گروسی فرشی - ۱ | [7555:219770](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=7555-219770) | 80 | 28700 |
| آزمون شخصیت نئو - فرم بلند (PI-R) - گروسی فرشی - ۲ | [7555:219307](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=7555-219307) | 1251 | 28700 |
| آزمون شخصیت نئو - فرم بلند (PI-R) - گروسی فرشی - ۳ | [7555:219580](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=7555-219580) | 2422 | 28700 |
| آزمون شخصیت نئو - فرم کوتاه (FFI) - حق‌شناس - ۱ | [5894:291248](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5894-291248) | 80 | 27858 |
| آزمون شخصیت نئو - فرم کوتاه (FFI) - حق‌شناس - ۲ | [5896:292923](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5896-292923) | 1251 | 27858 |
| آزمون شخصیت نئو - فرم بلند (PI-R) - حق‌شناس - نسخه بانوان - ۱ | [5499:150889](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5499-150889) | 80 | 27016 |
| آزمون شخصیت نئو - فرم بلند (PI-R) - حق‌شناس - نسخه بانوان - ۲ | [5714:156383](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5714-156383) | 1251 | 27016 |
| آزمون شخصیت نئو - فرم بلند (PI-R) - حق‌شناس - نسخه بانوان - ۳ | [5714:157888](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5714-157888) | 2422 | 27016 |
| آزمون شخصیت نئو - فرم بلند (PI-R) - حق‌شناس - نسخه آقایان - ۱ | [5472:149823](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5472-149823) | 80 | 26174 |
| آزمون شخصیت نئو - فرم بلند (PI-R) - حق‌شناس - نسخه آقایان - ۲ | [5499:152601](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5499-152601) | 1251 | 26174 |
| آزمون شخصیت نئو - فرم بلند (PI-R) - حق‌شناس - نسخه آقایان - ۳ | [5535:153410](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5535-153410) | 2422 | 26174 |
| پرسشنامه خودپنداره بک (BSCT) | [5404:149288](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5404-149288) | 80 | 25332 |
| پرسشنامه شخصیت ۲۰۲۵ - فرم کوتاه | [5295:137063](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5295-137063) | 87 | 24490 |
| پرسشنامه شخصیت ۲۰۲۵ - فرم بلند - ۳ | [5275:131739](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5275-131739) | 87 | 23648 |
| پرسشنامه شخصیت ۲۰۲۵ - فرم بلند - ۴ | [5281:135417](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5281-135417) | 1250 | 23648 |
| پرسشنامه شخصیت ۲۰۲۵ - فرم بلند - ۱ | [5230:129917](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5230-129917) | 87 | 22806 |
| پرسشنامه شخصیت ۲۰۲۵ - فرم بلند - ۲ | [5275:129758](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5275-129758) | 1250 | 22806 |
| آزمون ذهنیت (رویه) یانگ (YMQ) - 3 | [4681:117788](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=4681-117788) | 87 | 21964 |
| آزمون ذهنیت (رویه) یانگ (YMQ) - 1 | [3566:122388](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3566-122388) | 87 | 21122 |
| آزمون ذهنیت (رویه) یانگ (YMQ) - 2 | [4680:115767](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=4680-115767) | 1250 | 21122 |
| پرسشنامه باورهای غیرمنطقی ازدواج | [3377:103558](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3377-103558) | 87 | 20280 |
| پرسشنامه عملکرد خانواده (FAD) - نسخه ۶۰ سوالی | [2916:97734](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=2916-97734) | 80 | 19438 |
| شخصیت تیپ‌نمای مایرز – بریگز (MBTI) | [929:88565](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=929-88565) | 80 | 18596 |
| پرسشنامه تعارضات زناشويی ثنایی (MCQ) | [819:87067](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=819-87067) | 84 | 17754 |
| پرسشنامه شخصیت نئو ۶۰ سوالی (NEO-FFI-60) | [796:87204](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=796-87204) | 80 | 16912 |
| پرسشنامه بالینی نوجوانان میلون (MACI) - مقیاس ابعادی گراسمن 1 | [407:82189](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=407-82189) | 84 | 16078 |
| پرسشنامه بالینی نوجوانان میلون (MACI) - مقیاس ابعادی گراسمن 2 | [484:81992](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=484-81992) | 1247 | 16078 |
| پرسشنامه بالینی نوجوانان میلون (MACI) - 1 | [364:81949](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=364-81949) | 84 | 15236 |
| پرسشنامه بالینی نوجوانان میلون (MACI) - 2 | [387:79688](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=387-79688) | 1247 | 15236 |
| پرسشنامه کیفیت زندگی سالمندان (LEIPAD) | [3:12558](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-12558) | 84 | 14394 |
| چک‌لیست نشانه‌های اختلالات روانی (SCL90) | [3:12703](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-12703) | 84 | 13552 |
| آزمون فرزندپروری یانگ (۱) | [3:13473](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-13473) | 84 | 12710 |
| آزمون فرزندپروری یانگ (۲) | [3:13835](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-13835) | 1247 | 12710 |
| آزمون روان‌بنه‌های یانگ - ۹۰ سوالی | [3:12882](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-12882) | 84 | 11868 |
| مقیاس کمال‌گرایی چندبعدی فراست | [3:14083](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-14083) | 84 | 11026 |
| بررسی سبک زندگی و سلامت | [3:15905](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-15905) | 84 | 10184 |
| کارکردهای شخصیت  - جان‌بزرگی - پژوهشی | [3:15471](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-15471) | 84 | 9342 |
| کارکردهای شخصیت  - جان‌بزرگی - بالینی | [3:15688](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-15688) | 1247 | 9342 |
| پرسشنامه هوش هیجانی بار-آن | [3:15207](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-15207) | 84 | 8500 |
| پرسشنامه رغبت‌سنج تحصیلی - شغلی هالند | [3:15091](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-15091) | 84 | 7658 |
| پرسشنامه رغبت‌سنج تحصیلی - شغلی هالند - ویرایش حوزه | [5908:296217](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5908-296217) | 1247 | 7658 |
| پرسشنامه هوش اخلاقی (MIQ) | [3:14995](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-14995) | 84 | 6816 |
| پرسشنامه هوش‌های چندگانه‌ی گاردنر (GMI) | [3:14937](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-14937) | 84 | 5974 |
| پرسشنامه یل‌براون وسواس - شدت وسواس | [2500:95113](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=2500-95113) | 1247 | 5973 |
| پرسشنامه یل‌براون وسواس | [3:14644](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-14644) | 84 | 5132 |
| پرسشنامه یل‌براون وسواس - شدت وسواس | [2488:92136](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=2488-92136) | 1247 | 5132 |
| پرسشنامه باورهاي غيرمنطقي جونز | [3:14532](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-14532) | 84 | 4290 |
| پرسشنامه انگیزش تحصیلی والراند | [3:14472](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-14472) | 84 | 3448 |
| پرسشنامه اجتناب شناختی سکستون وداگاس | [3:14412](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-14412) | 84 | 2606 |
| پرسشنامه نظم‌جویی شناختی - هیجانی (فرم کوتاه) | [3:14323](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-14323) | 84 | 1764 |
| پرسشنامه سیاهه روانی - اجتماعی نیرومندی من 32 سوالی | [3:14230](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-14230) | 84 | 922 |
| پرسشنامه باورهای وسواسی | [3:14167](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-14167) | 84 | 80 |

### Heat Maps

[سکشن 3:15973](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-15973)؛ تعداد فریم صفحه: 2. مختصات نسبت به این سکشن است.

| فریم | node | x | y |
|---|---|---:|---:|
| پرسشنامه اضطراب کودکان اسپنس - نسخه والدین | [3:16003](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-16003) | 80 | 922 |
| پرسشنامه احساس گناه گوکلر و جونز | [3:15974](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-15974) | 80 | 80 |

### Templates

[سکشن 3:16115](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-16115)؛ تعداد فریم صفحه: 1. مختصات نسبت به این سکشن است.

| فریم | node | x | y |
|---|---|---:|---:|
| Template A4 - 96 PPI - Landscape | [3:16116](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=3-16116) | 80 | 80 |

### فریم صفحه خارج از سکشن‌های خانواده

مختصات نسبت به Profiles است و با y داخل XY مقایسهٔ زمانی نمی‌شود.

| فریم | node | x | y |
|---|---|---:|---:|
| آزمون شخصیت نئو - فرم بلند (PI-R) - حق‌شناس - کلاسیک | [5978:215205](https://www.figma.com/design/Ev7eB2DQIWjRhIkFnqD38V/Assessments---v3.0.0?node-id=5978-215205) | 18920 | 6164 |
