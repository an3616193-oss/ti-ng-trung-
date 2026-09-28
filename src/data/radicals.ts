export interface RadicalItem {
  radical: string;
  pinyin: string;
  hanViet: string;
  strokes: number;
  meaningVi: string;
  exampleChars: string[];
}

export interface StrokeTypeItem {
  nameZh: string;
  nameVi: string;
  pinyin: string;
  symbol: string;
  description: string;
  examples: string[];
}

export const COMMON_RADICALS: RadicalItem[] = [
  { radical: '亻', pinyin: 'rén', hanViet: 'NHÂN ĐỨNG', strokes: 2, meaningVi: 'Người, phẩm chất, quan hệ giữa con người', exampleChars: ['你', '他', '休', '们', '什', '作'] },
  { radical: '氵', pinyin: 'shuǐ', hanViet: 'CHẤM THỦY', strokes: 3, meaningVi: 'Nước, chất lỏng, sông hồ biển cả', exampleChars: ['江', '河', '海', '洗', '渴', '汉'] },
  { radical: '艹', pinyin: 'cǎo', hanViet: 'ĐẦU THẢO', strokes: 3, meaningVi: 'Cỏ cây, thảo mộc, hoa lá, thực vật', exampleChars: ['茶', '花', '草', '药', '英', '菜'] },
  { radical: '口', pinyin: 'kǒu', hanViet: 'KHẨU', strokes: 3, meaningVi: 'Miệng, ăn uống, lời nói, âm thanh', exampleChars: ['吃', '喝', '唱', '问', '叫', '听'] },
  { radical: '讠', pinyin: 'yán', hanViet: 'NGÔN', strokes: 2, meaningVi: 'Lời nói, ngôn ngữ, đàm thoại, sách vở', exampleChars: ['话', '说', '语', '读', '认', '谢'] },
  { radical: '女', pinyin: 'nǚ', hanViet: 'NỮ', strokes: 3, meaningVi: 'Phụ nữ, tính nữ, mẹ, chị em gái', exampleChars: ['好', '妈', '姐', '妹', '奶', '她'] },
  { radical: '忄', pinyin: 'xīn', hanViet: 'TÂM ĐỨNG', strokes: 3, meaningVi: 'Tâm trí, cảm xúc, tâm trạng, tư duy', exampleChars: ['快', '忙', '慢', '怕', '情', '忆'] },
  { radical: '心', pinyin: 'xīn', hanViet: 'TÂM NẰM', strokes: 4, meaningVi: 'Trái tim, tình cảm, suy tưởng', exampleChars: ['想', '感', '意', '态', '思', '忘'] },
  { radical: '木', pinyin: 'mù', hanViet: 'MỘC', strokes: 4, meaningVi: 'Cây cối, gỗ, đồ dùng bằng gỗ', exampleChars: ['林', '森', '桌', '椅', '本', '机'] },
  { radical: '日', pinyin: 'rì', hanViet: 'NHẬT', strokes: 4, meaningVi: 'Mặt trời, ban ngày, thời gian, ánh sáng', exampleChars: ['明', '时', '早', '昨', '晚', '晴'] },
  { radical: '月', pinyin: 'yuè', hanViet: 'NGUYỆT / NHỤC', strokes: 4, meaningVi: 'Mặt trăng hoặc các bộ phận thân thể cơ bắp', exampleChars: ['期', '朋', '胖', '服', '脑', '脚'] },
  { radical: '火', pinyin: 'huǒ', hanViet: 'HỎA', strokes: 4, meaningVi: 'Lửa, ánh sáng, nhiệt độ, nấu nướng', exampleChars: ['灯', '热', '烤', '烧', '灰', '煤'] },
  { radical: '灬', pinyin: 'huǒ', hanViet: 'TỨ HỎA', strokes: 4, meaningVi: 'Lửa nằm dưới đáy (nấu chín, làm nóng)', exampleChars: ['点', '热', '照', '熟', '焦', '然'] },
  { radical: '土', pinyin: 'tǔ', hanViet: 'THỔ', strokes: 3, meaningVi: 'Đất cát, mặt đất, công trình địa chất', exampleChars: ['在', '地', '块', '城', '场', '增'] },
  { radical: '辶', pinyin: 'chuò', hanViet: 'QUAI XƯỚC', strokes: 3, meaningVi: 'Bước đi, đường đi, di chuyển, thời gian trôi', exampleChars: ['这', '送', '进', '远', '近', '退'] },
  { radical: '饣', pinyin: 'shí', hanViet: 'THỰC', strokes: 3, meaningVi: 'Thức ăn, ẩm thực, ăn uống', exampleChars: ['饭', '饱', '饿', '饮', '馆', '饼'] },
  { radical: '钅', pinyin: 'jīn', hanViet: 'KIM', strokes: 5, meaningVi: 'Kim loại, vàng bạc, tiền tệ, vũ khí', exampleChars: ['钱', '银', '钟', '铁', '钢', '错'] },
  { radical: '犭', pinyin: 'quǎn', hanViet: 'KHUYỂN', strokes: 3, meaningVi: 'Động vật, dã thú bốn chân', exampleChars: ['猫', '狗', '猪', '猴', '狼', '猜'] },
  { radical: '宀', pinyin: 'mián', hanViet: 'MIÊN', strokes: 3, meaningVi: 'Mái nhà, gian phòng, nơi trú ẩn an toàn', exampleChars: ['家', '安', '宝', '室', '字', '它'] },
  { radical: '目', pinyin: 'mù', hanViet: 'MỤC', strokes: 5, meaningVi: 'Mắt, thị giác, ánh nhìn, ngắm nhìn', exampleChars: ['看', '眼', '睛', '睡', '见', '省'] },
  { radical: '足', pinyin: 'zú', hanViet: 'TÚC', strokes: 7, meaningVi: 'Bàn chân, bước chân, vận động chạy nhảy', exampleChars: ['跑', '跳', '路', '跟', '踢', '跌'] },
  { radical: '鸟', pinyin: 'niǎo', hanViet: 'ĐIỂU', strokes: 5, meaningVi: 'Loài chim, lông vũ, biết bay', exampleChars: ['鸡', '鸭', '鹅', '鸣', '鸽', '鹰'] }
];

export const STROKE_TYPES: StrokeTypeItem[] = [
  { nameZh: '横', pinyin: 'héng', nameVi: 'Ngang', symbol: '一', description: 'Nét thẳng ngang từ trái sang phải', examples: ['一', '十', '大', '三'] },
  { nameZh: '竖', pinyin: 'shù', nameVi: 'Sổ', symbol: '丨', description: 'Nét thẳng đứng kéo từ trên xuống dưới', examples: ['十', '中', '木', '山'] },
  { nameZh: '撇', pinyin: 'piě', nameVi: 'Phẩy', symbol: '丿', description: 'Nét cong vuốt chếch từ trên xuống dưới sang bên trái', examples: ['八', '人', '月', '千'] },
  { nameZh: '捺', pinyin: 'nà', nameVi: 'Mác', symbol: '乀', description: 'Nét thẳng hoặc gợn hơi chúc xuống sang bên phải', examples: ['人', '大', '天', '木'] },
  { nameZh: '点', pinyin: 'diǎn', nameVi: 'Chấm', symbol: '丶', description: 'Chấm nhẹ từ trên xuống dưới chếch phải', examples: ['广', '六', '主', '文'] },
  { nameZh: '提', pinyin: 'tí', nameVi: 'Hất', symbol: '㇀', description: 'Nét hất xéo từ dưới góc trái lên trên bên phải', examples: ['冰', '冷', '地', '江'] },
  { nameZh: '折', pinyin: 'zhé', nameVi: 'Gập', symbol: '𠃍', description: 'Nét chuyển hướng đổi góc (ngang gập, sổ gập...)', examples: ['口', '日', '四', '田'] },
  { nameZh: '钩', pinyin: 'gōu', nameVi: 'Móc', symbol: '亅', description: 'Nét có phần đuôi móc lại nhọn hoắt', examples: ['小', '水', '月', '了'] }
];
