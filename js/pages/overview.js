// Trang tổng quan.
import {
    DB, icon,money,sum,stat, gpa, grade, link, esc
} from '../config.js';

import { state, isPaid } from './state.js';
import { main } from '../layout.js';
import { newsPanel } from '../news.js';

export function overview() {
    const fees = DB.fees.filter(f => f.semester === '2026-1');
    main.innerHTML = `
        <section class="welcome">
            <div>
                <span class="welcome-kicker">
                    HỌC TẬP HÔM NAY, VỮNG BƯỚC NGÀY MAI
                </span>

                <p>Chào mừng trở lại,</p>

                <h1>
                    ${esc(state.student.name)}
                    <span>✦</span>
                </h1>

                <div class="welcome-date">
                    ${icon('schedule')}
                    ${
                        new Intl.DateTimeFormat('vi-VN', {
                            dateStyle: 'full',
                            timeZone: 'Asia/Ho_Chi_Minh'
                        }).format(new Date())
                    }
                </div>
            </div>

            <div class="welcome-art" aria-hidden="true">
                <div class="orbit"></div>

                <div class="cap-tile">
                    ${icon('cap')}
                </div>

                <span class="art-spark">✧</span>
            </div>
        </section>

        <div class="section-caption">
            <h2>Góc học tập của bạn</h2>
            <span>Học kỳ I · 2026 – 2027</span>
        </div>

        <div class="stats-grid">
            ${
                stat(
                    'GPA tích lũy',
                    gpa(DB.results),
                    'Thang điểm 4.0 · Dữ liệu mẫu',
                    'results',
                    'blue'
                )
            }

            ${
                stat(
                    'Tín chỉ tích lũy',
                    sum(
                        DB.results.filter(r => grade(r)[1] > 0),
                        'credits'
                    ),
                    'Tín chỉ đã đạt trong dữ liệu mẫu',
                    'book',
                    'purple'
                )
            }

            ${
                stat(
                    'Buổi học mỗi tuần',
                    DB.schedule.length,
                    'Lịch mẫu · 07/09 – 20/12/2026',
                    'schedule',
                    'orange'
                )
            }

            ${
                stat(
                    'Học phí còn lại',
                    money(
                        sum(
                            fees.filter(f => !isPaid(f)),
                            'amount'
                        )
                    ),
                    'Hạn đóng minh họa: 30/10/2026',
                    'tuition',
                    'green'
                )
            }
        </div>

        <div class="quick-links">
            ${
                [
                    [
                        'schedule',
                        'orange',
                        'Sắp xếp thời gian',
                        'Thời khóa biểu'
                    ],
                    [
                        'tuition',
                        'green',
                        'Theo dõi tài chính',
                        'Tra cứu học phí'
                    ],
                    [
                        'results',
                        'blue',
                        'Hành trình học tập',
                        'Kết quả học tập'
                    ],
                    [
                        'profile',
                        'purple',
                        'Thông tin của bạn',
                        'Hồ sơ sinh viên'
                    ]
                ].map(([key, color, sub, title]) => `
                    <a href="${link(key)}" class="quick-link">
                        <span class="quick-icon ${color}">
                            ${icon(key)}
                        </span>

                        <span>
                            <small>${sub}</small>
                            <b>${title}</b>
                        </span>

                        ${icon('arrow')}
                    </a>
                `).join('')
            }
        </div>

        <div class="news-grid">
            ${newsPanel('Tin nhà trường', 'school')}
            ${newsPanel('Tin đào tạo', 'training')}
        </div>

        <div class="bottom-grid">
            <section class="panel">
                <div class="panel-heading">
                    <h2>Hoạt động sinh viên</h2>
                    <span class="badge blue">THÁNG 10</span>
                </div>

                <div class="activity">
                    <div class="activity-art">
                        ${icon('cap')}

                        <span>
                            CREATIVE<br>CAMPUS
                        </span>
                    </div>

                    <div>
                        <span class="eyebrow">
                            KẾT NỐI & PHÁT TRIỂN
                        </span>

                        <h3>Tuần lễ sinh viên sáng tạo</h3>

                        <p>
                            Cùng chia sẻ ý tưởng, khám phá công nghệ
                            và tạo nên những điều mới.
                        </p>

                        <button class="text-btn" data-news="3">
                            Khám phá hoạt động
                            ${icon('arrow')}
                        </button>
                    </div>
                </div>
            </section>

            <section class="panel reminders">
                <div class="panel-heading">
                    <h2>Đừng bỏ lỡ</h2>
                    ${icon('clock')}
                </div>

                <div class="reminder">
                    <div class="date-box">
                        <b>16</b>
                        <span>THÁNG 10</span>
                    </div>

                    <div>
                        <h3>Đăng ký bổ sung học phần</h3>

                        <p>
                            Kiểm tra kế hoạch học tập của bạn.
                        </p>

                        <button class="text-btn" data-news="4">
                            Xem thông báo
                            ${icon('arrow')}
                        </button>
                    </div>
                </div>

                <div class="reminder">
                    <div class="date-box warm">
                        <b>30</b>
                        <span>THÁNG 10</span>
                    </div>

                    <div>
                        <h3>Hoàn thành học phí học kỳ I</h3>

                        <p>
                            Theo dõi các khoản phí còn lại.
                        </p>

                        <a class="text-btn" href="${link('tuition')}">
                            Xem học phí
                            ${icon('arrow')}
                        </a>
                    </div>
                </div>
            </section>
        </div>
    `;
}