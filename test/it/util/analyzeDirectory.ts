import * as fs from 'fs';
import * as path from 'path';

export const analyzeDirectory = (leftPath: string, rightPath: string) => {
  const report = createReport(leftPath, rightPath);
  const text = getReportText(report);
  return { report, text };
};

// x x x x 型定義 x x x x
type AnalyzeReport = AnalyzeResultItem[];
type AnalyzeResultDiff = 'none' | 'left-only' | 'right-only' | 'both';
type AnalyzeResultItem = AnalyzeResultItemFile | AnalyzeResultItemDirectory;
type AnalyzeResultItemFile = { pathname: string, type: 'file', diff: AnalyzeResultDiff, };
type AnalyzeResultItemDirectory = { pathname: string, type: 'directory', diff: AnalyzeResultDiff, subdir?: AnalyzeReport };

// x x x x レポート作成 x x x x
const createReport = (leftPath: string, rightPath: string): AnalyzeReport => {
  const leftItems = fs.readdirSync(leftPath);
  const rightItems = fs.readdirSync(rightPath);

  const report: AnalyzeReport = [];
  for (let item of leftItems) {
    const leftItemPath = path.join(leftPath, item);
    const leftItemIsDir = fs.lstatSync(leftItemPath).isDirectory();
    const rightItemPath = path.join(rightPath, item);
    if (fs.existsSync(rightItemPath)) {
      const rightItemIsDir = fs.lstatSync(rightItemPath).isDirectory();
      if (leftItemIsDir && rightItemIsDir) { // 両方ともディレクトリの場合
        report.push({ pathname: item, diff: 'none', type: 'directory', subdir: createReport(leftItemPath, rightItemPath) });
      } else if (!leftItemIsDir && !rightItemIsDir) { // 両方ともファイルの場合
        const sameFile = checkBothFileIsEqual(leftItemPath, rightItemPath);
        report.push({ pathname: item, diff: sameFile ? 'none' : 'both', type: 'file' });
      } else if (leftItemIsDir && !rightItemIsDir) { // 左はディレクトリ、右はファイル
        report.push({ pathname: item, diff: 'left-only', type: 'directory' });
        report.push({ pathname: item, diff: 'right-only', type: 'file' });
      } else if (!leftItemIsDir && rightItemIsDir) { // 左はファイル、右はディレクトリ
        report.push({ pathname: item, diff: 'left-only', type: 'file' });
        report.push({ pathname: item, diff: 'right-only', type: 'directory' });
      }
    } else {
      report.push({ pathname: item, diff: 'left-only', type: leftItemIsDir ? 'directory' : 'file' });
    }
  }
  for (let item of rightItems) {
    if (report.some(({ pathname }) => pathname === item)) continue;
    const rightItemPath = path.join(rightPath, item);
    const rightItemIsDir = fs.lstatSync(rightItemPath).isDirectory();
    report.push({ pathname: item, diff: 'right-only', type: rightItemIsDir ? 'directory' : 'file' });
  }
  return report;

};

const checkBothFileIsEqual = (leftFilePath: string, rightFilePath: string) => {
  const leftBuffer = fs.readFileSync(leftFilePath);
  const rightBuffer = fs.readFileSync(rightFilePath);
  return leftBuffer.equals(rightBuffer);
};

// x x x x 文字列化 x x x x
const getReportText = (report: AnalyzeReport): string => {
  const array: string[] = [];
  array.push('- root');
  array.push(...report.map((i) => reportItemToStrings(i)).reduce((p, c) => [...p, ...c], []).map((v) => `  ${v}`));
  return array.join('\n');
};
const reportItemToStrings = (item: AnalyzeResultItem): string[] => {
  const lines = [`- [${item.type === 'file' ? 'f' : 'd'}]${item.pathname}${getDiffStr(item.diff)}`];
  if (item.type === 'directory' && item.subdir) {
    lines.push(
      ...item.subdir
        .map((i) => reportItemToStrings(i))
        .reduce((p, c) => [...p, ...c], [])
        .map((v) => `  ${v}`)
    );
  }
  return lines;
};
const getDiffStr = (diff: AnalyzeResultDiff) => {
  if (diff === 'none') return '';
  if (diff === 'left-only') return ' <<';
  if (diff === 'right-only') return ' >>';
  if (diff === 'both') return ' <>';
  return '';
};
