import { ReadingItem } from '../types';
import { parseFullTextToSentences } from '../utils/segmenter';

interface RawReadingSource {
  id: string;
  titleZh: string;
  titlePinyin: string;
  titleVi: string;
  category: ReadingItem['category'];
  hskLevel: number;
  summaryVi: string;
  rawText: string;
  translations: string[];
  vocabulary?: {
    word: string;
    pinyin: string;
    hanViet: string;
    meaningVi: string;
    hsk?: number;
  }[];
}

const RAW_READINGS: RawReadingSource[] = [
  {
    id: 'hsk1-self-intro',
    titleZh: '自我介绍',
    titlePinyin: 'zìwǒ jièshào',
    titleVi: 'Tự giới thiệu bản thân',
    category: 'hsk1',
    hskLevel: 1,
    summaryVi: 'Bài đọc HSK 1 cơ bản giới thiệu họ tên, tuổi tác, quốc tịch và thói quen học tiếng Trung.',
    rawText: `你好！我叫李明。我是越南人。我现在二十岁。
我喜欢学习汉语。我的老师是中国人。
她很好，我们都很喜欢她。
我每天早上喝茶，看中文书。
很高兴认识你！`,
    translations: [
      'Xin chào! Tôi tên là Lý Minh. Tôi là người Việt Nam. Hiện tại tôi hai mươi tuổi.',
      'Tôi rất thích học tiếng Hán. Cô giáo của tôi là người Trung Quốc.',
      'Cô ấy rất tốt bụng, tất cả chúng tôi đều rất quý mến cô ấy.',
      'Mỗi ngày vào buổi sáng tôi đều uống trà và đọc sách tiếng Trung.',
      'Rất vui được làm quen với bạn!'
    ],
    vocabulary: [
      { word: '你好', pinyin: 'nǐ hǎo', hanViet: 'NHỈ HẢO', meaningVi: 'Xin chào', hsk: 1 },
      { word: '越南', pinyin: 'Yuènán', hanViet: 'VIỆT NAM', meaningVi: 'Việt Nam', hsk: 2 },
      { word: '学习', pinyin: 'xuéxí', hanViet: 'HỌC TẬP', meaningVi: 'Học tập', hsk: 1 },
      { word: '汉语', pinyin: 'Hànyǔ', hanViet: 'HÁN NGỮ', meaningVi: 'Tiếng Hán', hsk: 1 },
      { word: '老师', pinyin: 'lǎoshī', hanViet: 'LÃO SƯ', meaningVi: 'Thầy cô giáo', hsk: 1 },
      { word: '高兴', pinyin: 'gāoxìng', hanViet: 'CAO HƯNG', meaningVi: 'Vui mừng', hsk: 1 },
      { word: '认识', pinyin: 'rènshi', hanViet: 'NHẬN THỨC', meaningVi: 'Quen biết', hsk: 1 }
    ]
  },
  {
    id: 'hsk1-cat',
    titleZh: '我的可爱小猫',
    titlePinyin: 'wǒ de kě\'ài xiǎomāo',
    titleVi: 'Chú mèo nhỏ đáng yêu của tôi',
    category: 'hsk1',
    hskLevel: 1,
    summaryVi: 'Kể về chú mèo cưng màu trắng xinh đẹp, các thói quen ăn cá và phơi nắng mỗi ngày.',
    rawText: `我家有一只小猫。它的名字叫白白。
白白身上都是白色的毛，非常漂亮。
它喜欢吃鱼，也喜欢喝水。
下午，它喜欢在椅子上睡觉。
它是我最好的朋友，我很爱它。`,
    translations: [
      'Nhà tôi có một chú mèo nhỏ. Tên của nó là Bạch Bạch.',
      'Toàn thân Bạch Bạch đều là lông màu trắng, rất đẹp.',
      'Nó rất thích ăn cá, và cũng thích uống nước.',
      'Vào buổi chiều, nó thích nằm ngủ trên chiếc ghế.',
      'Nó là người bạn thân thiết nhất của tôi, tôi rất yêu nó.'
    ],
    vocabulary: [
      { word: '小猫', pinyin: 'xiǎomāo', hanViet: 'TIỂU MIÊU', meaningVi: 'Mèo con', hsk: 1 },
      { word: '名字', pinyin: 'míngzi', hanViet: 'DANH TỰ', meaningVi: 'Tên gọi', hsk: 1 },
      { word: '白色', pinyin: 'báisè', hanViet: 'BẠCH SẮC', meaningVi: 'Màu trắng', hsk: 1 },
      { word: '朋友', pinyin: 'péngyou', hanViet: 'BẰNG HỮU', meaningVi: 'Bạn bè', hsk: 1 }
    ]
  },
  {
    id: 'hsk1-fruit-market',
    titleZh: '在水果店买苹果',
    titlePinyin: 'zài shuǐguǒ diàn mǎi píngguǒ',
    titleVi: 'Mua táo ở tiệm hoa quả',
    category: 'hsk1',
    hskLevel: 1,
    summaryVi: 'Đoạn đối thoại và miêu tả mua bán hoa quả quen thuộc: hỏi giá, chọn táo ngọt và trả tiền.',
    rawText: `今天天气很好，我去水果店买东西。
水果店里有苹果、西瓜和香蕉。
我问老板：“请问，苹果多少钱一斤？”
老板笑着说：“五块钱一斤，很甜！”
我买了三斤大苹果。一共十五块钱。`,
    translations: [
      'Hôm nay thời tiết rất đẹp, tôi đến cửa hàng hoa quả để mua đồ.',
      'Trong tiệm hoa quả có táo, dưa hấu và chuối.',
      'Tôi hỏi ông chủ: "Xin hỏi, táo bao nhiêu tiền một cân?"',
      'Ông chủ mỉm cười đáp: "Năm tệ một cân, ngọt lắm!"',
      'Tôi đã mua ba cân táo to. Tổng cộng hết mười lăm tệ.'
    ],
    vocabulary: [
      { word: '水果', pinyin: 'shuǐguǒ', hanViet: 'THỦY QUẢ', meaningVi: 'Hoa quả', hsk: 1 },
      { word: '多少', pinyin: 'duōshao', hanViet: 'ĐA THIỂU', meaningVi: 'Bao nhiêu', hsk: 1 },
      { word: '苹果', pinyin: 'píngguǒ', hanViet: 'BÌNH QUẢ', meaningVi: 'Quả táo', hsk: 1 },
      { word: '东西', pinyin: 'dōngxi', hanViet: 'ĐÔNG TÂY', meaningVi: 'Đồ đạc', hsk: 1 }
    ]
  },
  {
    id: 'hsk2-travel-beijing',
    titleZh: '第一次去北京旅行',
    titlePinyin: 'dì yī cì qù Běijīng lǚxíng',
    titleVi: 'Lần đầu tiên đi du lịch Bắc Kinh',
    category: 'hsk2',
    hskLevel: 2,
    summaryVi: 'Chia sẻ trải nghiệm lần đầu đến Bắc Kinh: thăm Vạn Lý Trường Thành, ăn vịt quay Bắc Kinh và đi tàu điện ngầm.',
    rawText: `去年秋天，我和朋友一起坐飞机去北京旅游。
北京是中国的首都，有很长的历史。
我们去了长城。俗话说：“不到长城非好汉”。
站在长城上，风景非常美丽。
晚上，我们还吃了有名的北京烤鸭，味道好极了！`,
    translations: [
      'Mùa thu năm ngoái, tôi cùng bạn bè đi máy bay đến Bắc Kinh du lịch.',
      'Bắc Kinh là thủ đô của Trung Quốc, có lịch sử rất lâu đời.',
      'Chúng tôi đã đến Vạn Lý Trường Thành. Tục ngữ có câu: "Bất đáo Trường Thành phi hảo hán".',
      'Đứng trên Trường Thành, phong cảnh vô cùng tráng lệ và tươi đẹp.',
      'Buổi tối, chúng tôi còn thưởng thức món vịt quay Bắc Kinh trứ danh, hương vị tuyệt ngon!'
    ],
    vocabulary: [
      { word: '北京', pinyin: 'Běijīng', hanViet: 'BẮC KINH', meaningVi: 'Bắc Kinh', hsk: 1 },
      { word: '旅游', pinyin: 'lǚyóu', hanViet: 'LỮ DU', meaningVi: 'Du lịch', hsk: 2 },
      { word: '飞机', pinyin: 'fēijī', hanViet: 'PHI CƠ', meaningVi: 'Máy bay', hsk: 1 },
      { word: '非常', pinyin: 'fēicháng', hanViet: 'PHI THƯỜNG', meaningVi: 'Vô cùng', hsk: 2 }
    ]
  },
  {
    id: 'hsk2-tea-habit',
    titleZh: '喝中国茶的好习惯',
    titlePinyin: 'hē Zhōngguó chá de hǎo xíguàn',
    titleVi: 'Thói quen tốt uống trà Trung Quốc',
    category: 'hsk2',
    hskLevel: 2,
    summaryVi: 'Tìm hiểu nét văn hóa uống trà xanh, giúp thanh lọc cơ thể, tĩnh tâm và tăng cường sức khỏe.',
    rawText: `在中国，很多人都喜欢喝茶。
茶有很多种，比如绿茶、红茶和花茶。
喝茶不仅让人感觉舒服，而且对身体健康很有好处。
工作累的时候，喝一杯热茶，可以帮助我们放松心情。
慢慢喝茶，也是一种享受生活的方式。`,
    translations: [
      'Ở Trung Quốc, rất nhiều người thích uống trà.',
      'Trà có nhiều loại, chẳng hạn như trà xanh, hồng trà và trà hoa.',
      'Uống trà không những làm người ta cảm thấy dễ chịu mà còn rất có lợi cho sức khỏe.',
      'Khi làm việc mệt mỏi, uống một tách trà nóng có thể giúp chúng ta thư giãn tâm trí.',
      'Chầm chậm thưởng trà cũng là một cách hưởng thụ cuộc sống tao nhã.'
    ],
    vocabulary: [
      { word: '中国', pinyin: 'Zhōngguó', hanViet: 'TRUNG QUỐC', meaningVi: 'Trung Quốc', hsk: 1 },
      { word: '身体', pinyin: 'shēntǐ', hanViet: 'THÂN THỂ', meaningVi: 'Cơ thể, sức khỏe', hsk: 2 },
      { word: '习惯', pinyin: 'xíguàn', hanViet: 'TẬP QUÁN', meaningVi: 'Thói quen', hsk: 3 },
      { word: '舒服', pinyin: 'shūfu', hanViet: 'THƯ PHỤC', meaningVi: 'Dễ chịu', hsk: 2 }
    ]
  },
  {
    id: 'hsk3-weekend-life',
    titleZh: '现代人的周末生活',
    titlePinyin: 'xiàndài rén de zhōumò shēnghuó',
    titleVi: 'Cuộc sống cuối tuần của người hiện đại',
    category: 'hsk3',
    hskLevel: 3,
    summaryVi: 'So sánh cách người trẻ thư giãn cuối tuần: đọc sách, tập thể thao, gặp bạn bè để tái tạo năng lượng.',
    rawText: `平日里，大家的工作都很忙碌，压力也比较大。
所以，周末是大家放松和调整自己的最好时间。
有的人喜欢待在家里看书、听音乐，给身心一个安静的休息。
也有的人喜欢和朋友去公园跑步或者骑自行车，呼吸新鲜空气。
合理的休息可以让我们在下周的工作中更有活力。`,
    translations: [
      'Những ngày thường, công việc của mọi người đều bận rộn và áp lực khá lớn.',
      'Vì vậy, cuối tuần là khoảng thời gian tốt nhất để mọi người thư giãn và điều chỉnh bản thân.',
      'Có người thích ở nhà đọc sách, nghe nhạc để cơ thể và tâm trí được nghỉ ngơi yên tĩnh.',
      'Cũng có người thích cùng bạn bè ra công viên chạy bộ hoặc đạp xe hít thở không khí trong lành.',
      'Sự nghỉ ngơi hợp lý giúp chúng ta có thêm năng lượng dồi dào trong tuần làm việc tiếp theo.'
    ],
    vocabulary: [
      { word: '现代', pinyin: 'xiàndài', hanViet: 'HIỆN ĐẠI', meaningVi: 'Hiện đại', hsk: 4 },
      { word: '周末', pinyin: 'zhōumò', hanViet: 'CHU MẠT', meaningVi: 'Cuối tuần', hsk: 2 },
      { word: '生活', pinyin: 'shēnghuó', hanViet: 'SINH HOẠT', meaningVi: 'Cuộc sống', hsk: 3 },
      { word: '自行车', pinyin: 'zìxíngchē', hanViet: 'TỰ HÀNH XA', meaningVi: 'Xe đạp', hsk: 2 }
    ]
  },
  {
    id: 'hsk3-true-friendship',
    titleZh: '朋友是珍贵的财富',
    titlePinyin: 'péngyou shì zhēnguì de cáifù',
    titleVi: 'Bạn bè là tài sản quý báu',
    category: 'hsk3',
    hskLevel: 3,
    summaryVi: 'Triết lý về tình bạn chân thành: người luôn lắng nghe, chia sẻ khi khó khăn và cùng ta tiến bộ.',
    rawText: `有人说，人生中最珍贵的东西不是金钱，而是真正的朋友。
当我们遇到困难时，朋友会伸出双手帮助我们。
当我们取得成功时，朋友会真心为我们感到高兴。
真正的朋友不仅能同甘共苦，还能互相理解和支持。
珍惜身边的每一个好朋友，我们的生活就会充满温暖。`,
    translations: [
      'Có người nói rằng, điều quý giá nhất trong đời người không phải là tiền bạc mà là người bạn chân chính.',
      'Khi chúng ta gặp khó khăn, bạn bè sẽ giang rộng đôi tay giúp đỡ chúng ta.',
      'Khi chúng ta gặt hái thành công, bạn bè sẽ thật lòng cảm thấy vui mừng cho chúng ta.',
      'Bạn bè đích thực không chỉ cùng chia ngọt sẻ bùi mà còn thấu hiểu và ủng hộ lẫn nhau.',
      'Hãy trân trọng từng người bạn tốt bên cạnh, cuộc sống của chúng ta sẽ tràn ngập hơi ấm.'
    ],
    vocabulary: [
      { word: '朋友', pinyin: 'péngyou', hanViet: 'BẰNG HỮU', meaningVi: 'Bạn bè', hsk: 1 },
      { word: '困难', pinyin: 'kùnnan', hanViet: 'KHỐN NAN', meaningVi: 'Khó khăn', hsk: 3 },
      { word: '帮助', pinyin: 'bāngzhù', hanViet: 'BANG TRỢ', meaningVi: 'Giúp đỡ', hsk: 2 },
      { word: '理解', pinyin: 'lǐjiě', hanViet: 'LÝ GIẢI', meaningVi: 'Thấu hiểu', hsk: 4 }
    ]
  },
  {
    id: 'hsk4-smartphone-impact',
    titleZh: '智能手机对现代生活的影响',
    titlePinyin: 'zhìnéng shǒujī duì xiàndài shēnghuó de yǐngxiǎng',
    titleVi: 'Ảnh hưởng của điện thoại thông minh đến cuộc sống',
    category: 'hsk4',
    hskLevel: 4,
    summaryVi: 'Bàn luận hai mặt của điện thoại thông minh: tiện lợi trong giao tiếp, thanh toán, nhưng cũng dễ gây nghiện và xa cách.',
    rawText: `如今，智能手机已经成为人们生活中不可缺少的一部分。
通过手机，我们可以随时随地上网查资料、看新闻、联系朋友。
移动支付也让出门买东西变得非常方便，甚至不用带现金。
然而，长时间看手机也会影响视力和睡眠，减少了人与人面对面的交流。
学会合理使用科技产品，做手机的主人，才能享受更健康的生活。`,
    translations: [
      'Ngày nay, điện thoại thông minh đã trở thành một phần không thể thiếu trong cuộc sống con người.',
      'Thông qua điện thoại, chúng ta có thể tra cứu tài liệu, đọc tin tức, liên lạc với bạn bè mọi lúc mọi nơi.',
      'Thanh toán di động cũng giúp việc ra ngoài mua sắm trở nên vô cùng thuận tiện, thậm chí không cần mang tiền mặt.',
      'Tuy nhiên, nhìn điện thoại trong thời gian dài cũng ảnh hưởng tới thị lực và giấc ngủ, làm giảm sự giao tiếp trực tiếp mặt đối mặt.',
      'Học cách sử dụng hợp lý các sản phẩm công nghệ, làm chủ chiếc điện thoại mới có thể tận hưởng cuộc sống lành mạnh hơn.'
    ],
    vocabulary: [
      { word: '手机', pinyin: 'shǒujī', hanViet: 'THỦ CƠ', meaningVi: 'Điện thoại di động', hsk: 2 },
      { word: '影响', pinyin: 'yǐngxiǎng', hanViet: 'ẢNH HƯỞNG', meaningVi: 'Ảnh hưởng, tác động', hsk: 3 },
      { word: '方便', pinyin: 'fāngbiàn', hanViet: 'PHƯƠNG TIỆN', meaningVi: 'Thuận tiện', hsk: 3 },
      { word: '交流', pinyin: 'jiāoliú', hanViet: 'GIAO LƯU', meaningVi: 'Giao tiếp, giao lưu', hsk: 4 }
    ]
  },
  {
    id: 'chengyu-mangren-moxiang',
    titleZh: '成语故事：盲人摸象',
    titlePinyin: 'chéngyǔ gùshi: mángrén mō xiàng',
    titleVi: 'Truyện thành ngữ: Thầy bói xem voi',
    category: 'chengyu',
    hskLevel: 4,
    summaryVi: 'Bài học triết lý sâu sắc: Mỗi người mù chỉ sờ được một bộ phận của con voi mà kết luận toàn thể, nhắc ta cần nhìn nhận sự việc khách quan và toàn diện.',
    rawText: `从前，有几个盲人想知道大象长什么样。
国王让他们去摸一头大象。
摸到大象牙的人说：“大象像一根萝卜。”
摸到大象耳朵的人说：“不对，大象像一把大扇子！”
摸到大象腿的人大喊：“你们都错了，大象明明像一根粗粗的柱子！”
摸到尾巴的人却说：“大象就是一条绳子嘛。”
这个故事告诉我们：看问题要全面，不能只凭片面的了解就盲目下结论。`,
    translations: [
      'Ngày xưa, có mấy người khiếm thị muốn biết con voi trông như thế nào.',
      'Nhà vua cho phép họ đến sờ thử một con voi to.',
      'Người sờ vào ngà voi nói: "Con voi giống như một củ cải."',
      'Người sờ vào tai voi nói: "Không đúng, con voi giống như chiếc quạt lớn!"',
      'Người sờ vào chân voi lớn tiếng: "Mọi người sai hết rồi, voi rõ ràng giống như một cây cột to!"',
      'Người sờ vào đuôi lại bảo: "Con voi chính là một sợi dây thừng mà thôi."',
      'Câu chuyện này dạy chúng ta: Nhìn nhận sự việc phải toàn diện, không thể chỉ dựa vào hiểu biết phiến diện mà vội vàng kết luận.'
    ],
    vocabulary: [
      { word: '盲人摸象', pinyin: 'mángrén mō xiàng', hanViet: 'MANH NHÂN MẠC TƯỢNG', meaningVi: 'Thầy bói xem voi', hsk: 5 },
      { word: '故事', pinyin: 'gùshi', hanViet: 'CỐ SỰ', meaningVi: 'Câu chuyện', hsk: 2 },
      { word: '发现', pinyin: 'fāxiàn', hanViet: 'PHÁT HIỆN', meaningVi: 'Phát hiện', hsk: 3 }
    ]
  },
  {
    id: 'chengyu-shou-zhu-dai-tu',
    titleZh: '成语故事：守株待兔',
    titlePinyin: 'chéngyǔ gùshi: shǒu zhū dài tù',
    titleVi: 'Truyện thành ngữ: Ôm cây đợi thỏ',
    category: 'chengyu',
    hskLevel: 4,
    summaryVi: 'Một người nông dân bắt được con thỏ đâm đầu vào gốc cây, từ đó bỏ việc đồng áng chỉ ngồi chờ thỏ khác, răn dạy không được trông chờ vận may ngẫu nhiên.',
    rawText: `战国时期，宋国有一个农夫在田里耕地。
突然，一只野兔飞快地跑过来，不小心撞在树桩上，折断脖子死了。
农夫没费一点力气，就白白得到了一只肥兔子。
他非常高兴，心里想：“种田太辛苦了，我不如天天守在树桩旁等兔子！”
于是，他放下农具，天天坐在树旁等待。
结果，再也没有兔子跑来撞树，他的田地也长满了野草。`,
    translations: [
      'Thời Chiến Quốc, nước Tống có một người nông dân đang cày ruộng.',
      'Đột nhiên, một con thỏ rừng phóng nhanh chạy qua, không may đâm sầm vào gốc cây, gãy cổ chết.',
      'Người nông dân không tốn một chút sức lực nào mà tự dưng có được một con thỏ béo tốt.',
      'Anh ta vô cùng mừng rỡ, thầm nghĩ: "Làm ruộng vất vả quá, chi bằng ngày nào mình cũng canh bên gốc cây chờ thỏ!"',
      'Thế là anh ta buông nông cụ, ngày ngày ngồi bên gốc cây ngóng đợi.',
      'Kết quả là chẳng còn con thỏ nào chạy đến đâm vào cây nữa, còn ruộng đồng của anh ta thì mọc đầy cỏ dại.'
    ],
    vocabulary: [
      { word: '守株待兔', pinyin: 'shǒu zhū dài tù', hanViet: 'THỦ CHU ĐÃI THỎ', meaningVi: 'Ôm cây đợi thỏ', hsk: 5 },
      { word: '高兴', pinyin: 'gāoxìng', hanViet: 'CAO HƯNG', meaningVi: 'Vui mừng', hsk: 1 },
      { word: '非常', pinyin: 'fēicháng', hanViet: 'PHI THƯỜNG', meaningVi: 'Vô cùng', hsk: 2 }
    ]
  },
  {
    id: 'chengyu-jing-di-zhi-wa',
    titleZh: '成语故事：井底之蛙',
    titlePinyin: 'chéngyǔ gùshi: jǐng dǐ zhī wā',
    titleVi: 'Truyện thành ngữ: Ếch ngồi đáy giếng',
    category: 'chengyu',
    hskLevel: 4,
    summaryVi: 'Chú ếch sống dưới giếng cạn ngỡ bầu trời chỉ bé bằng miệng giếng. Khi nghe rùa biển kể về đại dương bao la mới bàng hoàng nhận ra sự nông cạn của mình.',
    rawText: `有一只青蛙住在一口废井里。
它觉得自己是井里的主人，生活得非常快活。
它对路过的大海龟吹嘘说：“你看我多自在！整个井水和天空都是我的。”
海龟听了，对青蛙讲述了东海的广阔与深邃：“大海千里之遥，万丈之深，旱涝不能改变。”
青蛙听完目瞪口呆，终于知道自己所见的天空不过是井口那么大。`,
    translations: [
      'Có một chú ếch sống trong một chiếc giếng hoang cạn.',
      'Nó cảm thấy mình là chúa tể của cái giếng, sống cuộc đời hết sức sung sướng tự tại.',
      'Nó khoe khoang với chú rùa biển đi ngang qua: "Anh nhìn xem tôi tự tại biết bao! Cả dòng nước và bầu trời này đều thuộc về tôi."',
      'Rùa biển nghe vậy bèn kể cho ếch nghe về sự rộng lớn và sâu thẳm của Biển Đông: "Biển lớn cách xa ngàn dặm, sâu vạn trượng, hạn hán hay lũ lụt đều không thể suy chuyển."',
      'Ếch nghe xong há hốc mồm kinh ngạc, cuối cùng mới nhận ra bầu trời mình thấy bấy lâu nay chỉ nhỏ bằng miệng giếng.'
    ],
    vocabulary: [
      { word: '井底之蛙', pinyin: 'jǐng dǐ zhī wā', hanViet: 'TỈNH ĐỂ CHI OA', meaningVi: 'Ếch ngồi đáy giếng', hsk: 5 },
      { word: '世界', pinyin: 'shìjiè', hanViet: 'THẾ GIỚI', meaningVi: 'Thế giới', hsk: 3 },
      { word: '自然', pinyin: 'zìrán', hanViet: 'TỰ NHIÊN', meaningVi: 'Tự nhiên', hsk: 4 }
    ]
  },
  {
    id: 'poem-jing-ye-si',
    titleZh: '唐诗：静夜思',
    titlePinyin: 'Táng shī: Jìng yè sī',
    titleVi: 'Thơ Đường: Tĩnh dạ tứ (Lý Bạch)',
    category: 'poem',
    hskLevel: 3,
    summaryVi: 'Kiệt tác thơ Đường ngũ ngôn tuyệt cú của thi tiên Lý Bạch về nỗi niềm hoài niệm cố hương dưới ánh trăng thanh.',
    rawText: `床前明月光，
疑是地上霜。
举头望明月，
低头思故乡。`,
    translations: [
      'Đầu giường ánh trăng rọi sáng,',
      'Ngỡ là lớp sương phủ trên mặt đất.',
      'Ngẩng đầu ngắm vầng trăng sáng tỏ,',
      'Cúi đầu dạ bồi hồi nhớ cố hương.'
    ],
    vocabulary: [
      { word: '静夜思', pinyin: 'Jìng yè sī', hanViet: 'TĨNH DẠ TƯ', meaningVi: 'Nỗi nhớ trong đêm thanh vắng', hsk: 4 },
      { word: '朋友', pinyin: 'péngyou', hanViet: 'BẰNG HỮU', meaningVi: 'Bạn bè', hsk: 1 }
    ]
  },
  {
    id: 'poem-chun-xiao',
    titleZh: '唐诗：春晓',
    titlePinyin: 'Táng shī: Chūn xiǎo',
    titleVi: 'Thơ Đường: Xuân hiểu (Mạnh Hạo Nhiên)',
    category: 'poem',
    hskLevel: 3,
    summaryVi: 'Bức họa thi ca rộn rã buổi sớm mùa xuân: giấc ngủ say nồng, tiếng chim hót líu lo và những cánh hoa rơi sau cơn mưa đêm.',
    rawText: `春眠不觉晓，
处处闻啼鸟。
夜来风雨声，
花落知多少。`,
    translations: [
      'Giấc ngủ xuân say nồng chẳng hay trời đã sáng,',
      'Khắp nơi vang vọng tiếng chim hót véo von.',
      'Đêm qua nghe thấy tiếng gió mưa gầm rít,',
      'Biết bao cánh hoa tươi đã rụng rơi.'
    ],
    vocabulary: [
      { word: '春晓', pinyin: 'Chūn xiǎo', hanViet: 'XUÂN HIỂU', meaningVi: 'Buổi sáng mùa xuân', hsk: 4 },
      { word: '天气', pinyin: 'tiānqì', hanViet: 'THIÊN KHÍ', meaningVi: 'Thời tiết', hsk: 1 }
    ]
  },
  {
    id: 'poem-guan-que-lou',
    titleZh: '唐诗：登鹳雀楼',
    titlePinyin: 'Táng shī: Dēng Guàn Què Lóu',
    titleVi: 'Thơ Đường: Đăng Quán Tước Lâu (Vương Chi Hoán)',
    category: 'poem',
    hskLevel: 3,
    summaryVi: 'Bài thơ hùng tráng gửi gắm chí lớn: Muốn thu trọn ngàn dặm phong cảnh vào tầm mắt, hãy bước lên thêm một tầng lầu cao hơn.',
    rawText: `白日依山尽，
黄河入海流。
欲穷千里目，
更上一层楼。`,
    translations: [
      'Mặt trời trắng nép theo dãy núi khuất dần,',
      'Dòng Hoàng Hà cuồn cuộn đổ về biển khơi.',
      'Muốn thu trọn tầm mắt ngàn dặm xa xôi,',
      'Hãy bước lên thêm một tầng lầu nữa.'
    ],
    vocabulary: [
      { word: '登鹳雀楼', pinyin: 'Dēng Guàn Què Lóu', hanViet: 'ĐĂNG QUÁN TƯỚC LÂU', meaningVi: 'Lên lầu Quán Tước', hsk: 4 }
    ]
  },
  {
    id: 'dialogue-restaurant',
    titleZh: '生活情景：在餐馆点餐',
    titlePinyin: 'shēnghuó qíngjǐng: zài cānguǎn diǎncān',
    titleVi: 'Tình huống giao tiếp: Gọi món tại quán ăn',
    category: 'dialogue',
    hskLevel: 2,
    summaryVi: 'Các mẫu câu giao tiếp thông dụng khi vào nhà hàng: xin thực đơn, gọi món ngon đặc sản và thanh toán.',
    rawText: `服务员，请给我们菜单！
请问你们这里的特色菜是什么？
我们要一份宫保鸡丁，一碗牛肉面，再来一壶热绿茶。
请问菜里可以少放一点辣椒吗？
好的，没问题。请稍等，菜马上就来！
服务员，买单，一共多少钱？`,
    translations: [
      'Phục vụ ơi, xin hãy cho chúng tôi xem thực đơn!',
      'Xin hỏi món đặc sản của nhà hàng mình là gì vậy ạ?',
      'Chúng tôi muốn gọi một phần gà Cung Bảo, một bát mì bò, và thêm một ấm trà xanh nóng.',
      'Xin hỏi trong món ăn có thể cho bớt ớt một chút được không?',
      'Dạ được ạ, không vấn đề gì. Xin quý khách đợi một lát, món ăn sẽ lên ngay!',
      'Phục vụ ơi, tính tiền giúp tôi, tổng cộng hết bao nhiêu tiền vậy?'
    ],
    vocabulary: [
      { word: '多少', pinyin: 'duōshao', hanViet: 'ĐA THIỂU', meaningVi: 'Bao nhiêu', hsk: 1 },
      { word: '绿茶', pinyin: 'lǜchá', hanViet: 'LỤC TRÀ', meaningVi: 'Trà xanh', hsk: 3 },
      { word: '不客气', pinyin: 'bú kèqi', hanViet: 'BẤT KHÁCH KHÍ', meaningVi: 'Không có chi', hsk: 1 }
    ]
  }
];

// Pre-build segmented reading items
export function getSampleReadings(): ReadingItem[] {
  return RAW_READINGS.map(item => ({
    id: item.id,
    titleZh: item.titleZh,
    titlePinyin: item.titlePinyin,
    titleVi: item.titleVi,
    category: item.category,
    hskLevel: item.hskLevel,
    summaryVi: item.summaryVi,
    contentZh: item.rawText,
    sentences: parseFullTextToSentences(item.rawText, item.translations),
    vocabulary: item.vocabulary,
    isCustom: false
  }));
}
