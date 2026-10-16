// Xuất dữ liệu CSV có BOM để Excel nhận tiếng Việt.
import { state } from './state.js';
import { toast } from '../layout.js';

export function csv(name, headers, rows) {
  const cell = value => '"' + String(value).replace(/"/g, '""') + '"';

  const blob = new Blob(
    ['\uFEFF' + [headers, ...rows].map(row => row.map(cell).join(',')).join('\r\n')],
    { type: 'text/csv;charset=utf-8;' }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = `${name}-${state.semester}.csv`;
  a.click();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Đã xuất tệp CSV.');
}