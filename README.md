# LPIC-1 Practice

Ứng dụng web luyện thi chứng chỉ **LPIC-1** (Linux Professional Institute Certification Level 1). Hỗ trợ hai kỳ thi **LPIC-101** và **LPIC-102**, mỗi kỳ có 120 câu hỏi.

**Demo:** [https://thangncdev.github.io/lpic-1/](https://thangncdev.github.io/lpic-1/)

## Tính năng

- **Danh sách câu hỏi** — Xem toàn bộ 120 câu hỏi kèm đáp án và giải thích, phù hợp để ôn lý thuyết.
- **Bài thi thử** — 60 câu ngẫu nhiên, thời gian 90 phút (giống kỳ thi thật).
- **Hai chế độ làm bài:**
  - **Exam Mode** — Không hiện đáp án trong lúc làm, xem kết quả sau khi nộp bài.
  - **Instant Feedback** — Phản hồi ngay sau mỗi câu, tiện cho việc ghi nhớ.
- **Lịch sử làm bài** — Lưu điểm số, thời gian và danh sách câu sai vào `localStorage`.
- **Giải thích chi tiết** — Mỗi câu hỏi có phần giải thích (nếu đã được bổ sung).

## Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router (HashRouter) |
| State | Zustand |
| Hosting | GitHub Pages |

## Yêu cầu

- Node.js 20+
- npm (hoặc pnpm)

## Chạy local

```bash
# Cài dependencies
npm install

# Chạy dev server (mặc định http://localhost:5173/lpic-1/)
npm run dev
```

Các lệnh khác:

```bash
npm run build      # Build production → thư mục dist/
npm run preview    # Xem trước bản build
npm run lint       # Kiểm tra ESLint
```

## Deploy

Ứng dụng được host trên **GitHub Pages** với base path `/lpic-1/` (cấu hình trong `vite.config.ts`).

### Tự động (khuyến nghị)

Mỗi khi push lên nhánh `main`, GitHub Actions sẽ tự build và deploy lên `gh-pages`:

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
```

### Thủ công

```bash
npm run deploy
```

Script `deploy.sh` sẽ build project, tạo nhánh `gh-pages` từ thư mục `dist/` và push lên remote.

> **Lưu ý:** Cần cấu hình GitHub Pages trong repo settings để serve từ nhánh `gh-pages`.

## Cấu trúc thư mục

```
lpic-1/
├── public/data/          # Ngân hàng câu hỏi (questions_101.json, questions_102.json)
├── scripts/              # Script quản lý giải thích câu hỏi
│   ├── apply-explanations.mjs
│   ├── validate-explanations.mjs
│   └── explanations/     # File giải thích theo từng batch
├── src/
│   ├── components/       # UI components (quiz, layout, shared)
│   ├── pages/            # Các trang (Home, Quiz, History, ...)
│   ├── hooks/            # Custom hooks (useQuiz)
│   ├── store/            # Zustand store
│   ├── types/            # TypeScript types
│   └── utils/            # Scoring, shuffle, ...
├── deploy.sh             # Script deploy thủ công
└── vite.config.ts
```

## Quản lý giải thích câu hỏi

Giải thích được lưu trong `scripts/explanations/` theo từng batch (ví dụ: `101_1-25_explanations.json`), sau đó merge vào file câu hỏi chính.

```bash
# Áp dụng giải thích vào file câu hỏi
node scripts/apply-explanations.mjs 101 scripts/explanations/101_1-25_explanations.json

# Kiểm tra tính hợp lệ của file giải thích
npm run validate:explanations
```

## Định dạng câu hỏi

Mỗi câu hỏi trong `public/data/questions_*.json` có cấu trúc:

```json
{
  "number": 1,
  "type": "multiple_choice",
  "question": "...",
  "options": [
    { "letter": "A", "text": "...", "isCorrect": false }
  ],
  "correctAnswers": ["B"],
  "correctText": null,
  "explanation": "...",
  "exam": "101"
}
```

Hỗ trợ hai loại: `multiple_choice` (trắc nghiệm) và `fill_blank` (điền đáp án).

## License

Private project.
