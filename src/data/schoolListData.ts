// Auto-generated school list data from CSV
// Structure: District → Nature → Schools

export interface School {
  name: string;
  nameEn: string;
}

export const HK_SCHOOL_DISTRICTS: string[] = [
  "中西區",
  "九龍城區",
  "元朗區",
  "北區",
  "南區",
  "大埔區",
  "屯門區",
  "東區",
  "沙田區",
  "油尖旺區",
  "深水埗區",
  "灣仔區",
  "荃灣區",
  "葵青區",
  "西貢區",
  "觀塘區",
  "離島區",
  "黃大仙區"
];

export const SCHOOL_NATURES: string[] = [
  "直接資助計劃",
  "英基學校協會",
  "資助",
  "按位津貼"
];

export const HK_SCHOOLS: Record<string, Record<string, School[]>> = {
  "沙田區": {
    "直接資助計劃": [
      {
        "name": "香港浸會大學附屬學校王錦輝中小學",
        "nameEn": "HONG KONG BAPTIST UNIVERSITY AFFILIATED SCHOOL WONG KAM FAI SECONDARY AND PRIMARY SCHOOL"
      },
      {
        "name": "培僑書院",
        "nameEn": "PUI KIU COLLEGE"
      },
      {
        "name": "香港浸會大學附屬學校王錦輝中小學",
        "nameEn": "HONG KONG BAPTIST UNIVERSITY AFFILIATED SCHOOL WONG KAM FAI SECONDARY AND PRIMARY SCHOOL"
      },
      {
        "name": "李寶椿聯合世界書院",
        "nameEn": "LI PO CHUN UNITED WORLD COLLEGE OF HONG KONG"
      },
      {
        "name": "培僑書院",
        "nameEn": "PUI KIU COLLEGE"
      },
      {
        "name": "香港神託會培基書院",
        "nameEn": "STEWARDS POOI KEI COLLEGE"
      },
      {
        "name": "林大輝中學",
        "nameEn": "LAM TAI FAI COLLEGE"
      },
      {
        "name": "德信中學",
        "nameEn": "TAK SUN SECONDARY SCHOOL"
      }
    ],
    "英基學校協會": [
      {
        "name": "SHATIN JUNIOR SCHOOL",
        "nameEn": "SHATIN JUNIOR SCHOOL"
      },
      {
        "name": "SHATIN COLLEGE",
        "nameEn": "SHATIN COLLEGE"
      },
      {
        "name": "SHATIN COLLEGE",
        "nameEn": "SHATIN COLLEGE"
      }
    ],
    "資助": [
      {
        "name": "保良局蕭漢森小學",
        "nameEn": "PO LEUNG KUK SIU HON-SUM PRIMARY SCHOOL"
      },
      {
        "name": "培基小學",
        "nameEn": "STEWARDS POOI KEI PRIMARY SCHOOL"
      },
      {
        "name": "循理會美林小學",
        "nameEn": "FREE METHODIST MEI LAM PRIMARY SCHOOL"
      },
      {
        "name": "香港中文大學校友會聯會張煊昌學校",
        "nameEn": "CUHK FEDERATION OF ALUMNI ASSOCIATION THOMAS CHEUNG SCHOOL"
      },
      {
        "name": "沙田循道衛理小學",
        "nameEn": "SHA TIN METHODIST PRIMARY SCHOOL"
      },
      {
        "name": "救世軍田家炳學校",
        "nameEn": "THE SALVATION ARMY TIN KA PING SCHOOL"
      },
      {
        "name": "沙田圍胡素貞博士紀念學校",
        "nameEn": "SHA TIN WAI DR. CATHERINE F. WOO MEMORIAL SCHOOL"
      },
      {
        "name": "迦密愛禮信小學",
        "nameEn": "CARMEL ALISON LAM PRIMARY SCHOOL"
      },
      {
        "name": "吳氏宗親總會泰伯紀念學校",
        "nameEn": "NG CLAN'S ASSOCIATION TAI PAK MEMORIAL SCHOOL"
      },
      {
        "name": "沙田崇真學校",
        "nameEn": "SHATIN TSUNG TSIN SCHOOL"
      },
      {
        "name": "保良局王賜豪(田心谷)小學",
        "nameEn": "PO LEUNG KUK DR. JIMMY WONG CHI-HO (TIN SUM VALLEY) PRIMARY SCHOOL"
      },
      {
        "name": "循理會白普理基金循理小學",
        "nameEn": "FREE METHODIST BRADBURY CHUN LEI PRIMARY SCHOOL"
      },
      {
        "name": "保良局莊啟程小學",
        "nameEn": "PO LEUNG KUK CHONG KEE TING PRIMARY SCHOOL"
      },
      {
        "name": "香港道教聯合會純陽小學",
        "nameEn": "HONG KONG TAOIST ASSOCIATION SHUN YEUNG PRIMARY SCHOOL"
      },
      {
        "name": "保良局雨川小學",
        "nameEn": "PO LEUNG KUK RIVERAIN PRIMARY SCHOOL"
      },
      {
        "name": "馬鞍山循道衛理小學",
        "nameEn": "MA ON SHAN METHODIST PRIMARY SCHOOL"
      },
      {
        "name": "九龍城浸信會禧年小學",
        "nameEn": "KOWLOON CITY BAPTIST CHURCH HAY NIEN PRIMARY SCHOOL"
      },
      {
        "name": "培基小學",
        "nameEn": "STEWARDS POOI KEI PRIMARY SCHOOL"
      },
      {
        "name": "基督教香港信義會禾輋信義學校",
        "nameEn": "THE EVANGELICAL LUTHERAN CHURCH OF HONG KONG WO CHE LUTHERAN SCHOOL"
      },
      {
        "name": "世界龍岡學校黃耀南小學",
        "nameEn": "LUNG KONG WORLD FEDERATION SCHOOL LTD. WONG YIU NAM PRIMARY SCHOOL"
      },
      {
        "name": "路德會梁鉅鏐小學",
        "nameEn": "LEUNG KUI KAU LUTHERAN PRIMARY SCHOOL"
      },
      {
        "name": "浸信會沙田圍呂明才小學",
        "nameEn": "BAPTIST (SHA TIN WAI) LUI MING CHOI PRIMARY SCHOOL"
      },
      {
        "name": "聖公會馬鞍山主風小學",
        "nameEn": "S.K.H. MA ON SHAN HOLY SPIRIT PRIMARY SCHOOL"
      },
      {
        "name": "香港九龍塘基督教中華宣道會台山陳元喜小學",
        "nameEn": "CHRISTIAN ALLIANCE TOI SHAN H. C. CHAN PRIMARY SCHOOL OF THE KOWLOON TONG CHURCH OF THE CHINESE CHRISTIAN AND MISSIONARY ALLIANCE, HONG KONG"
      },
      {
        "name": "浸信會呂明才小學",
        "nameEn": "BAPTIST LUI MING CHOI PRIMARY SCHOOL"
      },
      {
        "name": "慈航學校",
        "nameEn": "CHI HONG PRIMARY SCHOOL"
      },
      {
        "name": "東莞工商總會張煌偉小學",
        "nameEn": "GENERAL CHAMBER OF COMMERCE & INDUSTRY OF THE TUNG KUN DISTRICT CHEONG WONG WAI PRIMARY SCHOOL"
      },
      {
        "name": "九龍城浸信會禧年(恩平)小學",
        "nameEn": "KOWLOON CITY BAPTIST CHURCH HAY NIEN (YAN PING) PRIMARY SCHOOL"
      },
      {
        "name": "保良局朱正賢小學",
        "nameEn": "PO LEUNG KUK CHEE JING YIN PRIMARY SCHOOL"
      },
      {
        "name": "基督教香港信義會馬鞍山信義學校",
        "nameEn": "THE EVANGELICAL LUTHERAN CHURCH OF HONG KONG MA ON SHAN LUTHERAN PRIMARY SCHOOL"
      },
      {
        "name": "東華三院冼次雲小學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS SIN CHU WAN PRIMARY SCHOOL"
      },
      {
        "name": "馬鞍山聖若瑟小學",
        "nameEn": "MA ON SHAN ST. JOSEPH'S PRIMARY SCHOOL"
      },
      {
        "name": "胡素貞博士紀念學校",
        "nameEn": "DR. CATHERINE F. WOO MEMORIAL SCHOOL"
      },
      {
        "name": "天主教聖華學校",
        "nameEn": "THE LITTLE FLOWER'S CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "馬鞍山靈糧小學",
        "nameEn": "MA ON SHAN LING LIANG PRIMARY SCHOOL"
      },
      {
        "name": "聖公會主風小學",
        "nameEn": "S.K.H. HOLY SPIRIT PRIMARY SCHOOL"
      },
      {
        "name": "香港九龍塘基督教中華宣道會陳元喜小學",
        "nameEn": "CHRISTIAN ALLIANCE H.C. CHAN PRIMARY SCHOOL OF THE KOWLOON TONG CHURCH OF THE CHINESE CHRISTIAN AND MISSIONARY ALLIANCE, HONG KONG"
      },
      {
        "name": "聖母無玷聖心學校",
        "nameEn": "IMMACULATE HEART OF MARY SCHOOL"
      },
      {
        "name": "東華三院蔡榮星小學",
        "nameEn": "TWGHS TSOI WING SING PRIMARY SCHOOL"
      },
      {
        "name": "浸信會呂明才中學",
        "nameEn": "BAPTIST LUI MING CHOI SECONDARY SCHOOL"
      },
      {
        "name": "保良局朱敬文中學",
        "nameEn": "PO LEUNG KUK C.W. CHU COLLEGE"
      },
      {
        "name": "沙田循道衞理中學",
        "nameEn": "SHA TIN METHODIST COLLEGE"
      },
      {
        "name": "天主教郭得勝中學",
        "nameEn": "KWOK TAK SENG CATHOLIC SECONDARY SCHOOL"
      },
      {
        "name": "沙田培英中學",
        "nameEn": "SHATIN PUI YING COLLEGE"
      },
      {
        "name": "聖母無玷聖心書院",
        "nameEn": "IMMACULATE HEART OF MARY COLLEGE"
      },
      {
        "name": "仁濟醫院董之英紀念中學",
        "nameEn": "YAN CHAI HOSPITAL TUNG CHI YING MEMORIAL SECONDARY SCHOOL"
      },
      {
        "name": "聖公會曾肇添中學",
        "nameEn": "SHENG KUNG HUI TSANG SHIU TIM SECONDARY SCHOOL"
      },
      {
        "name": "樂道中學",
        "nameEn": "LOCK TAO SECONDARY SCHOOL"
      },
      {
        "name": "佛教黃允畋中學",
        "nameEn": "BUDDHIST WONG WAN TIN COLLEGE"
      },
      {
        "name": "聖公會林裘謀中學",
        "nameEn": "SHENG KUNG HUI LAM KAU MOW SECONDARY SCHOOL"
      },
      {
        "name": "保良局胡忠中學",
        "nameEn": "PO LEUNG KUK WU CHUNG COLLEGE"
      },
      {
        "name": "博愛醫院陳楷紀念中學",
        "nameEn": "POK OI HOSPITAL CHAN KAI MEMORIAL COLLEGE"
      },
      {
        "name": "香港九龍塘基督教中華宣道會鄭榮之中學",
        "nameEn": "CHRISTIAN ALLIANCE CHENG WING GEE COLLEGE OF THE KOWLOON TONG CHURCH OF THE CHINESE CHRISTIAN AND MISSIONARY ALLIANCE, HONG KONG"
      },
      {
        "name": "東華三院邱金元中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS YOW KAM YUEN COLLEGE"
      },
      {
        "name": "台山商會中學",
        "nameEn": "TOI SHAN ASSOCIATION COLLEGE"
      },
      {
        "name": "賽馬會體藝中學",
        "nameEn": "JOCKEY CLUB TI-I COLLEGE"
      },
      {
        "name": "曾璧山(崇蘭)中學",
        "nameEn": "TSANG PIK SHAN (SUNG LAN) SECONDARY SCHOOL"
      },
      {
        "name": "東莞工商總會劉百樂中學",
        "nameEn": "GENERAL CHAMBER OF COMMERCE AND INDUSTRY OF THE TUNG KUN DISTRICT LAU PAK LOK SECONDARY SCHOOL"
      },
      {
        "name": "香港中國婦女會馮堯敬紀念中學",
        "nameEn": "THE HONG KONG CHINESE WOMEN'S CLUB FUNG YIU KING MEMORIAL SECONDARY SCHOOL"
      },
      {
        "name": "東華三院黃鳳翎中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS WONG FUNG LING COLLEGE"
      },
      {
        "name": "香港中文大學校友會聯會陳震夏中學",
        "nameEn": "CUHK FAA CHAN CHUN HA SECONDARY SCHOOL"
      },
      {
        "name": "東華三院馮黃鳳亭中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS MRS FUNG WONG FUNG TING COLLEGE"
      },
      {
        "name": "沙田蘇浙公學",
        "nameEn": "KIANGSU-CHEKIANG COLLEGE (SHATIN)"
      },
      {
        "name": "沙田崇真中學",
        "nameEn": "SHATIN TSUNG TSIN SECONDARY SCHOOL"
      },
      {
        "name": "潮州會館中學",
        "nameEn": "CHIU CHOW ASSOCIATION SECONDARY SCHOOL"
      },
      {
        "name": "樂善堂楊葛小琳中學",
        "nameEn": "LOK SIN TONG YOUNG KO HSIAO LIN SECONDARY SCHOOL"
      },
      {
        "name": "馬鞍山崇真中學",
        "nameEn": "MA ON SHAN TSUNG TSIN SECONDARY SCHOOL"
      },
      {
        "name": "佛教覺光法師中學",
        "nameEn": "BUDDHIST KOK KWONG SECONDARY SCHOOL"
      },
      {
        "name": "基督書院",
        "nameEn": "CHRIST COLLEGE"
      },
      {
        "name": "五旬節林漢光中學",
        "nameEn": "PENTECOSTAL LAM HON KWONG SCHOOL"
      },
      {
        "name": "聖羅撒書院",
        "nameEn": "ST. ROSE OF LIMA'S COLLEGE"
      },
      {
        "name": "馬鞍山聖若瑟中學",
        "nameEn": "MA ON SHAN ST. JOSEPH'S SECONDARY SCHOOL"
      },
      {
        "name": "五育中學",
        "nameEn": "NG YUK SECONDARY SCHOOL"
      },
      {
        "name": "明愛馬鞍山中學",
        "nameEn": "CARITAS MA ON SHAN SECONDARY SCHOOL"
      },
      {
        "name": "沙田循道衞理中學",
        "nameEn": "SHA TIN METHODIST COLLEGE"
      },
      {
        "name": "青年會書院",
        "nameEn": "CHINESE Y.M.C.A. COLLEGE"
      },
      {
        "name": "天主教郭得勝中學",
        "nameEn": "KWOK TAK SENG CATHOLIC SECONDARY SCHOOL"
      },
      {
        "name": "曾璧山(崇蘭)中學",
        "nameEn": "TSANG PIK SHAN (SUNG LAN) SECONDARY SCHOOL"
      }
    ]
  },
  "南區": {
    "直接資助計劃": [
      {
        "name": "聖保羅男女中學附屬小學",
        "nameEn": "ST. PAUL'S CO-EDUCATIONAL COLLEGE PRIMARY SCHOOL"
      },
      {
        "name": "聖保羅書院小學",
        "nameEn": "ST. PAUL'S COLLEGE PRIMARY SCHOOL"
      },
      {
        "name": "港大同學會書院",
        "nameEn": "HKUGA COLLEGE"
      },
      {
        "name": "聖士提反書院",
        "nameEn": "ST. STEPHEN'S COLLEGE"
      }
    ],
    "英基學校協會": [
      {
        "name": "KENNEDY SCHOOL",
        "nameEn": "KENNEDY SCHOOL"
      },
      {
        "name": "THE SOUTH ISLAND SCHOOL",
        "nameEn": "THE SOUTH ISLAND SCHOOL"
      },
      {
        "name": "WEST ISLAND SCHOOL",
        "nameEn": "WEST ISLAND SCHOOL"
      }
    ],
    "資助": [
      {
        "name": "東華三院鶴山學校",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS HOK SHAN SCHOOL"
      },
      {
        "name": "嘉諾撒培德學校",
        "nameEn": "PUI TAK CANOSSIAN PRIMARY SCHOOL"
      },
      {
        "name": "華富邨寶血小學",
        "nameEn": "PRECIOUS BLOOD PRIMARY SCHOOL (WAH FU ESTATE)"
      },
      {
        "name": "聖公會置富始南小學",
        "nameEn": "S.K.H. CHI FU CHI NAM PRIMARY SCHOOL"
      },
      {
        "name": "聖公會田灣始南小學",
        "nameEn": "S.K.H. TIN WAN CHI NAM PRIMARY SCHOOL"
      },
      {
        "name": "聖伯多祿天主教小學",
        "nameEn": "ST. PETER'S CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "海怡寶血小學",
        "nameEn": "PRECIOUS BLOOD PRIMARY SCHOOL (SOUTH HORIZONS)"
      },
      {
        "name": "香港仔聖伯多祿天主教小學",
        "nameEn": "ABERDEEN ST PETER'S CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "鴨脷洲街坊學校",
        "nameEn": "APLICHAU KAIFONG PRIMARY SCHOOL"
      },
      {
        "name": "聖伯多祿中學",
        "nameEn": "ST. PETER'S SECONDARY SCHOOL"
      },
      {
        "name": "嘉諾撒培德書院",
        "nameEn": "PUI TAK CANOSSIAN COLLEGE"
      },
      {
        "name": "培英中學",
        "nameEn": "PUI YING SECONDARY SCHOOL"
      },
      {
        "name": "嘉諾撒聖心書院",
        "nameEn": "SACRED HEART CANOSSIAN COLLEGE"
      },
      {
        "name": "香港航海學校",
        "nameEn": "HONG KONG SEA SCHOOL"
      },
      {
        "name": "聖公會呂明才中學",
        "nameEn": "SHENG KUNG HUI LUI MING CHOI SECONDARY SCHOOL"
      },
      {
        "name": "明愛莊月明中學",
        "nameEn": "CARITAS CHONG YUET MING SECONDARY SCHOOL"
      },
      {
        "name": "新會商會陳白沙紀念中學",
        "nameEn": "SAN WUI COMMERCIAL SOCIETY CHAN PAK SHA SCHOOL"
      },
      {
        "name": "香港仔浸信會呂明才書院",
        "nameEn": "ABERDEEN BAPTIST LUI MING CHOI COLLEGE"
      },
      {
        "name": "香港真光書院",
        "nameEn": "HONG KONG TRUE LIGHT COLLEGE"
      },
      {
        "name": "香港仔工業學校",
        "nameEn": "ABERDEEN TECHNICAL SCHOOL"
      },
      {
        "name": "余振強紀念第二中學",
        "nameEn": "YU CHUN KEUNG MEMORIAL COLLEGE NO. 2"
      }
    ]
  },
  "九龍城區": {
    "直接資助計劃": [
      {
        "name": "保良局林文燦英文小學",
        "nameEn": "PO LEUNG KUK LAM MAN CHAN ENGLISH PRIMARY SCHOOL"
      },
      {
        "name": "拔萃男書院",
        "nameEn": "DIOCESAN BOYS' SCHOOL"
      },
      {
        "name": "保良局林文燦英文小學",
        "nameEn": "PO LEUNG KUK LAM MAN CHAN ENGLISH PRIMARY SCHOOL"
      },
      {
        "name": "保良局顏寶鈴書院",
        "nameEn": "PO LEUNG KUK NGAN PO LING COLLEGE"
      },
      {
        "name": "拔萃男書院",
        "nameEn": "DIOCESAN BOYS' SCHOOL"
      },
      {
        "name": "香港兆基創意書院(李兆基基金會贊助、香港當代文化中心主辦)",
        "nameEn": "HONG KONG INSTITUTE OF CONTEMPORARY CULTURE LEE SHAU KEE SCHOOL OF CREATIVITY"
      },
      {
        "name": "協恩中學",
        "nameEn": "HEEP YUNN SCHOOL"
      },
      {
        "name": "創知中學",
        "nameEn": "SCIENTIA SECONDARY SCHOOL"
      }
    ],
    "英基學校協會": [
      {
        "name": "BEACON HILL SCHOOL",
        "nameEn": "BEACON HILL SCHOOL"
      },
      {
        "name": "賽馬會善樂學校",
        "nameEn": "JOCKEY CLUB SARAH ROE SCHOOL"
      },
      {
        "name": "KOWLOON JUNIOR SCHOOL",
        "nameEn": "KOWLOON JUNIOR SCHOOL"
      },
      {
        "name": "賽馬會善樂學校",
        "nameEn": "JOCKEY CLUB SARAH ROE SCHOOL"
      },
      {
        "name": "KING GEORGE V SCHOOL",
        "nameEn": "KING GEORGE V SCHOOL"
      }
    ],
    "資助": [
      {
        "name": "嘉諾撒聖家學校",
        "nameEn": "HOLY FAMILY CANOSSIAN SCHOOL"
      },
      {
        "name": "合一堂學校",
        "nameEn": "HOP YAT CHURCH SCHOOL"
      },
      {
        "name": "中華基督教會基華小學(九龍塘)",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI WA PRIMARY SCHOOL (KOWLOON TONG)"
      },
      {
        "name": "合一堂學校",
        "nameEn": "HOP YAT CHURCH SCHOOL"
      },
      {
        "name": "九龍塘天主教華德學校",
        "nameEn": "KOWLOON TONG BISHOP WALSH CATHOLIC SCHOOL"
      },
      {
        "name": "九龍靈光小學",
        "nameEn": "EMMANUEL PRIMARY SCHOOL, KOWLOON"
      },
      {
        "name": "聖公會奉基小學",
        "nameEn": "S.K.H. FUNG KEI PRIMARY SCHOOL"
      },
      {
        "name": "保良局何壽南小學",
        "nameEn": "PO LEUNG KUK STANLEY HO SAU NAN PRIMARY SCHOOL"
      },
      {
        "name": "嘉諾撒聖家學校(九龍塘)",
        "nameEn": "HOLY FAMILY CANOSSIAN SCHOOL (KOWLOON TONG)"
      },
      {
        "name": "聖公會牧愛小學",
        "nameEn": "S.K.H. GOOD SHEPHERD PRIMARY SCHOOL"
      },
      {
        "name": "聖羅撒學校",
        "nameEn": "ST. ROSE OF LIMA'S SCHOOL"
      },
      {
        "name": "獻主會聖馬善樂小學",
        "nameEn": "ST. EUGENE DE MAZENOD OBLATE PRIMARY SCHOOL"
      },
      {
        "name": "聖公會聖十架小學",
        "nameEn": "S.K.H. HOLY CROSS PRIMARY SCHOOL"
      },
      {
        "name": "葛量洪校友會黃埔學校",
        "nameEn": "GRANTHAM COLLEGE OF EDUCATION PAST STUDENTS' ASSOCIATION WHAMPOA PRIMARY SCHOOL"
      },
      {
        "name": "基督教香港信義會紅磡信義學校",
        "nameEn": "ELCHK HUNG HOM LUTHERAN PRIMARY SCHOOL"
      },
      {
        "name": "天神嘉諾撒學校",
        "nameEn": "HOLY ANGELS CANOSSIAN SCHOOL"
      },
      {
        "name": "嘉諾撒聖家學校",
        "nameEn": "HOLY FAMILY CANOSSIAN SCHOOL"
      },
      {
        "name": "獻主會小學",
        "nameEn": "OBLATE PRIMARY SCHOOL"
      },
      {
        "name": "拔萃小學",
        "nameEn": "DIOCESAN PREPARATORY SCHOOL"
      },
      {
        "name": "天主教領島學校",
        "nameEn": "LING TO CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "瑪利諾修院學校(小學部)",
        "nameEn": "MARYKNOLL CONVENT SCHOOL (PRIMARY SECTION)"
      },
      {
        "name": "協恩中學附屬小學",
        "nameEn": "HEEP YUNN PRIMARY SCHOOL"
      },
      {
        "name": "黃埔宣道小學",
        "nameEn": "ALLIANCE PRIMARY SCHOOL, WHAMPOA"
      },
      {
        "name": "聖公會聖匠小學",
        "nameEn": "S.K.H. HOLY CARPENTER PRIMARY SCHOOL"
      },
      {
        "name": "聖公會聖提摩太小學",
        "nameEn": "S.K.H. ST. TIMOTHY'S PRIMARY SCHOOL"
      },
      {
        "name": "陳瑞祺(喇沙)小學",
        "nameEn": "CHAN SUI KI (LA SALLE) PRIMARY SCHOOL"
      },
      {
        "name": "中華基督教會灣仔堂基道小學(九龍城)",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA WANCHAI CHURCH KEI TO PRIMARY SCHOOL (KOWLOON CITY)"
      },
      {
        "name": "聖公會奉基千禧小學",
        "nameEn": "S.K.H. FUNG KEI MILLENNIUM PRIMARY SCHOOL"
      },
      {
        "name": "喇沙小學",
        "nameEn": "LA SALLE PRIMARY SCHOOL"
      },
      {
        "name": "耀山學校",
        "nameEn": "IU SHAN SCHOOL"
      },
      {
        "name": "瑪利諾修院學校(中學部)",
        "nameEn": "MARYKNOLL CONVENT SCHOOL (SECONDARY SECTION)"
      },
      {
        "name": "香港培正中學",
        "nameEn": "PUI CHING MIDDLE SCHOOL"
      },
      {
        "name": "九龍真光中學",
        "nameEn": "KOWLOON TRUE LIGHT SCHOOL"
      },
      {
        "name": "聖公會聖匠中學",
        "nameEn": "SKH HOLY CARPENTER SECONDARY SCHOOL"
      },
      {
        "name": "新亞中學",
        "nameEn": "NEW ASIA MIDDLE SCHOOL"
      },
      {
        "name": "順德聯誼總會胡兆熾中學",
        "nameEn": "SHUN TAK FRATERNAL ASSOCIATION SEAWARD WOO COLLEGE"
      },
      {
        "name": "鄧鏡波學校",
        "nameEn": "TANG KING PO SCHOOL"
      },
      {
        "name": "喇沙書院",
        "nameEn": "LA SALLE COLLEGE"
      },
      {
        "name": "香港培道中學",
        "nameEn": "POOI TO MIDDLE SCHOOL"
      },
      {
        "name": "聖公會聖三一堂中學",
        "nameEn": "SHENG KUNG HUI HOLY TRINITY CHURCH SECONDARY SCHOOL"
      },
      {
        "name": "聖公會蔡功譜中學",
        "nameEn": "SHENG KUNG HUI TSOI KUNG PO SECONDARY SCHOOL"
      },
      {
        "name": "東華三院黃笏南中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS WONG FUT NAM COLLEGE"
      },
      {
        "name": "迦密中學",
        "nameEn": "CARMEL SECONDARY SCHOOL"
      },
      {
        "name": "德蘭中學",
        "nameEn": "ST. TERESA SECONDARY SCHOOL"
      },
      {
        "name": "何明華會督銀禧中學",
        "nameEn": "BISHOP HALL JUBILEE SCHOOL"
      },
      {
        "name": "嘉諾撒聖家書院",
        "nameEn": "HOLY FAMILY CANOSSIAN COLLEGE"
      },
      {
        "name": "旅港開平商會中學",
        "nameEn": "HOI PING CHAMBER OF COMMERCE SECONDARY SCHOOL"
      },
      {
        "name": "余振強紀念中學",
        "nameEn": "YU CHUN KEUNG MEMORIAL COLLEGE"
      },
      {
        "name": "華英中學",
        "nameEn": "WA YING COLLEGE"
      },
      {
        "name": "陳瑞祺(喇沙)書院",
        "nameEn": "CHAN SUI KI (LA SALLE) COLLEGE"
      },
      {
        "name": "五旬節中學",
        "nameEn": "PENTECOSTAL SCHOOL"
      },
      {
        "name": "九龍塘學校(中學部)",
        "nameEn": "KOWLOON TONG SCHOOL (SECONDARY SECTION)"
      },
      {
        "name": "基督教女青年會丘佐榮中學",
        "nameEn": "THE Y.W.C.A. HIOE TJO YOENG COLLEGE"
      },
      {
        "name": "民生書院",
        "nameEn": "MUNSANG COLLEGE"
      },
      {
        "name": "獻主會聖母院書院",
        "nameEn": "NOTRE DAME COLLEGE"
      },
      {
        "name": "禮賢會彭學高紀念中學",
        "nameEn": "RHENISH CHURCH PANG HOK-KO MEMORIAL COLLEGE"
      },
      {
        "name": "中華基督教會基道中學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI TO SECONDARY SCHOOL"
      },
      {
        "name": "文理書院(九龍)",
        "nameEn": "COGNITIO COLLEGE (KOWLOON)"
      }
    ]
  },
  "觀塘區": {
    "直接資助計劃": [
      {
        "name": "福建中學附屬學校",
        "nameEn": "FUKIEN SECONDARY SCHOOL AFFILIATED SCHOOL"
      },
      {
        "name": "地利亞修女紀念學校(協和)",
        "nameEn": "DELIA MEMORIAL SCHOOL (HIP WO)"
      },
      {
        "name": "基督教中國佈道會聖道迦南書院",
        "nameEn": "EVANGELIZE CHINA FELLOWSHIP SAINT TOO CANAAN COLLEGE"
      },
      {
        "name": "慕光英文書院",
        "nameEn": "MU KUANG ENGLISH SCHOOL"
      },
      {
        "name": "地利亞修女紀念學校(協和二中)",
        "nameEn": "DELIA MEMORIAL SCHOOL (HIP WO NO.2 COLLEGE)"
      },
      {
        "name": "滙基書院(東九龍)",
        "nameEn": "UNITED CHRISTIAN COLLEGE (KOWLOON EAST)"
      },
      {
        "name": "福建中學",
        "nameEn": "FUKIEN SECONDARY SCHOOL"
      }
    ],
    "資助": [
      {
        "name": "香港道教聯合會雲泉學校",
        "nameEn": "HONG KONG TAOIST ASSOCIATION WUN TSUEN SCHOOL"
      },
      {
        "name": "聖公會李兆強小學",
        "nameEn": "S.K.H. LEE SHIU KEUNG PRIMARY SCHOOL"
      },
      {
        "name": "聖公會基樂小學",
        "nameEn": "S.K.H. KEI LOK PRIMARY SCHOOL"
      },
      {
        "name": "迦密梁省德學校",
        "nameEn": "CARMEL LEUNG SING TAK SCHOOL"
      },
      {
        "name": "樂華天主教小學",
        "nameEn": "LOK WAH CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "佐敦谷聖若瑟天主教小學",
        "nameEn": "JORDAN VALLEY ST. JOSEPH'S CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "坪石天主教小學",
        "nameEn": "PING SHEK ESTATE CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "聖安當小學",
        "nameEn": "ST. ANTONIUS PRIMARY SCHOOL"
      },
      {
        "name": "聖愛德華天主教小學",
        "nameEn": "ST. EDWARD'S CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "聖公會聖約翰曾肇添小學",
        "nameEn": "S.K.H. ST. JOHN'S TSANG SHIU TIM PRIMARY SCHOOL"
      },
      {
        "name": "天主教佑華小學",
        "nameEn": "OUR LADY OF CHINA CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "香港道教聯合會圓玄學院陳呂重德紀念學校",
        "nameEn": "HONG KONG TAOIST ASSOCIATION THE YUEN YUEN INSTITUTE CHAN LUI CHUNG TAK MEMORIAL SCHOOL"
      },
      {
        "name": "天主教柏德學校",
        "nameEn": "BISHOP PASCHANG CATHOLIC SCHOOL"
      },
      {
        "name": "樂善堂楊仲明學校",
        "nameEn": "LOK SIN TONG YEUNG CHUNG MING PRIMARY SCHOOL"
      },
      {
        "name": "聖公會德田李兆強小學",
        "nameEn": "S.K.H. TAK TIN LEE SHIU KEUNG PRIMARY SCHOOL"
      },
      {
        "name": "路德會聖馬太學校(秀茂坪)",
        "nameEn": "ST. MATTHEW'S LUTHERAN SCHOOL (SAU MAU PING)"
      },
      {
        "name": "基督教聖約教會堅樂小學",
        "nameEn": "THE MISSION COVENANT CHURCH HOLM GLAD PRIMARY SCHOOL"
      },
      {
        "name": "中華基督教會基法小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI FAAT PRIMARY SCHOOL"
      },
      {
        "name": "聖若翰天主教小學",
        "nameEn": "ST. JOHN THE BAPTIST CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "中華基督教會基法小學(油塘)",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI FAAT PRIMARY SCHOOL (YAU TONG)"
      },
      {
        "name": "聖公會油塘基顯小學",
        "nameEn": "S.K.H. YAUTONG KEI HIN PRIMARY SCHOOL"
      },
      {
        "name": "浸信宣道會呂明才小學",
        "nameEn": "CONSERVATIVE BAPTIST LUI MING CHOI PRIMARY SCHOOL"
      },
      {
        "name": "聖公會九龍灣基樂小學",
        "nameEn": "S.K.H. KOWLOON BAY KEI LOK PRIMARY SCHOOL"
      },
      {
        "name": "秀明小學",
        "nameEn": "SAU MING PRIMARY SCHOOL"
      },
      {
        "name": "佛教慈敬學校",
        "nameEn": "BUDDHIST CHI KING PRIMARY SCHOOL"
      },
      {
        "name": "秀茂坪天主教小學",
        "nameEn": "SAU MAU PING CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "閩僑小學",
        "nameEn": "MAN KIU ASSOCIATION PRIMARY SCHOOL"
      },
      {
        "name": "藍田循道衛理小學",
        "nameEn": "LAM TIN METHODIST PRIMARY SCHOOL"
      },
      {
        "name": "聖公會基顯小學",
        "nameEn": "S.K.H. KEI HIN PRIMARY SCHOOL"
      },
      {
        "name": "九龍灣聖若翰天主教小學",
        "nameEn": "KOWLOON BAY ST. JOHN THE BAPTIST CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "中華基督教會基智中學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI CHI SECONDARY SCHOOL"
      },
      {
        "name": "瑪利諾中學",
        "nameEn": "MARYKNOLL SECONDARY SCHOOL"
      },
      {
        "name": "聖公會基孝中學",
        "nameEn": "SHENG KUNG HUI KEI HAU SECONDARY SCHOOL"
      },
      {
        "name": "香港聖公會何明華會督中學",
        "nameEn": "HONG KONG SHENG KUNG HUI BISHOP HALL SECONDARY SCHOOL"
      },
      {
        "name": "仁濟醫院羅陳楚思中學",
        "nameEn": "YAN CHAI HOSPITAL LAW CHAN CHOR SI COLLEGE"
      },
      {
        "name": "聖安當女書院",
        "nameEn": "ST. ANTONIUS GIRLS' COLLEGE"
      },
      {
        "name": "聖言中學",
        "nameEn": "SING YIN SECONDARY SCHOOL"
      },
      {
        "name": "藍田聖保祿中學",
        "nameEn": "ST. PAUL'S SCHOOL (LAM TIN)"
      },
      {
        "name": "寧波第二中學",
        "nameEn": "NING PO NO.2 COLLEGE"
      },
      {
        "name": "順利天主教中學",
        "nameEn": "SHUN LEE CATHOLIC SECONDARY SCHOOL"
      },
      {
        "name": "觀塘瑪利諾書院",
        "nameEn": "KWUN TONG MARYKNOLL COLLEGE"
      },
      {
        "name": "新生命教育協會呂郭碧鳳中學",
        "nameEn": "NEW LIFE SCHOOLS INCORPORATION LUI KWOK PAT FONG COLLEGE"
      },
      {
        "name": "聖若瑟英文中學",
        "nameEn": "ST. JOSEPH'S ANGLO-CHINESE SCHOOL"
      },
      {
        "name": "佛教何南金中學",
        "nameEn": "BUDDHIST HO NAM KAM COLLEGE"
      },
      {
        "name": "香港布廠商會朱石麟中學",
        "nameEn": "HONG KONG WEAVING MILLS ASSOCIATION CHU SHEK LUN SECONDARY SCHOOL"
      },
      {
        "name": "基督教聖約教會堅樂中學",
        "nameEn": "THE MISSION COVENANT CHURCH HOLM GLAD COLLEGE"
      },
      {
        "name": "中華基督教會蒙民偉書院",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA MONG MAN WAI COLLEGE"
      },
      {
        "name": "聖公會梁季彜中學",
        "nameEn": "S.K.H. LEUNG KWAI YEE SECONDARY SCHOOL"
      },
      {
        "name": "香港道教聯合會青松中學",
        "nameEn": "THE HONG KONG TAOIST ASSOCIATION CHING CHUNG SECONDARY SCHOOL"
      },
      {
        "name": "梁式芝書院",
        "nameEn": "LEUNG SHEK CHEE COLLEGE"
      },
      {
        "name": "天主教普照中學",
        "nameEn": "PO CHIU CATHOLIC SECONDARY SCHOOL"
      },
      {
        "name": "聖傑靈女子中學",
        "nameEn": "ST. CATHARINE'S SCHOOL FOR GIRLS"
      },
      {
        "name": "寧波公學",
        "nameEn": "NING PO COLLEGE"
      },
      {
        "name": "高雷中學",
        "nameEn": "KO LUI SECONDARY SCHOOL"
      },
      {
        "name": "五邑司徒浩中學",
        "nameEn": "F.D.B.W.A. SZETO HO SECONDARY SCHOOL"
      }
    ]
  },
  "西貢區": {
    "直接資助計劃": [
      {
        "name": "播道書院",
        "nameEn": "EVANGEL COLLEGE"
      },
      {
        "name": "保良局陸慶濤小學",
        "nameEn": "PO LEUNG KUK LUK HING TOO PRIMARY SCHOOL"
      },
      {
        "name": "香港華人基督教聯會真道書院",
        "nameEn": "THE HONG KONG CHINESE CHRISTIAN CHURCHES UNION LOGOS ACADEMY"
      },
      {
        "name": "優才(楊殷有娣)書院",
        "nameEn": "G.T. (ELLEN YEUNG) COLLEGE"
      },
      {
        "name": "啓思中學",
        "nameEn": "CREATIVE SECONDARY SCHOOL"
      },
      {
        "name": "保良局羅氏基金中學",
        "nameEn": "PO LEUNG KUK LAWS FOUNDATION COLLEGE"
      },
      {
        "name": "香港華人基督教聯會真道書院",
        "nameEn": "THE HONG KONG CHINESE CHRISTIAN CHURCHES UNION LOGOS ACADEMY"
      },
      {
        "name": "播道書院",
        "nameEn": "EVANGEL COLLEGE"
      },
      {
        "name": "將軍澳香島中學",
        "nameEn": "HEUNG TO SECONDARY SCHOOL (TSEUNG KWAN O)"
      },
      {
        "name": "萬鈞匯知中學",
        "nameEn": "MAN KWAN QUALIED COLLEGE"
      },
      {
        "name": "優才(楊殷有娣)書院",
        "nameEn": "G.T. (ELLEN YEUNG) COLLEGE"
      }
    ],
    "英基學校協會": [
      {
        "name": "CLEARWATER BAY SCHOOL",
        "nameEn": "CLEARWATER BAY SCHOOL"
      },
      {
        "name": "CLEARWATER BAY SCHOOL",
        "nameEn": "CLEARWATER BAY SCHOOL"
      }
    ],
    "資助": [
      {
        "name": "保良局馮晴紀念小學",
        "nameEn": "PO LEUNG KUK FUNG CHING MEMORIAL PRIMARY SCHOOL"
      },
      {
        "name": "香海正覺蓮社佛教黃藻森學校",
        "nameEn": "HHCKLA BUDDHIST WONG CHO SUM SCHOOL"
      },
      {
        "name": "仁濟醫院陳耀星小學",
        "nameEn": "YAN CHAI HOSPITAL CHAN IU SENG PRIMARY SCHOOL"
      },
      {
        "name": "將軍澳天主教小學",
        "nameEn": "TSEUNG KWAN O CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "西貢中心李少欽紀念學校",
        "nameEn": "SAI KUNG CENTRAL LEE SIU YAM MEMORIAL SCHOOL"
      },
      {
        "name": "基督教神召會梁省德小學",
        "nameEn": "ASSEMBLY OF GOD LEUNG SING TAK PRIMARY SCHOOL"
      },
      {
        "name": "順德聯誼總會梁潔華小學",
        "nameEn": "SHUN TAK FRATERNAL ASSOCIATION LEUNG KIT WAH PRIMARY SCHOOL"
      },
      {
        "name": "聖公會將軍澳基德小學",
        "nameEn": "S.K.H. TSEUNG KWAN O KEI TAK PRIMARY SCHOOL"
      },
      {
        "name": "將軍澳循道衛理小學",
        "nameEn": "TSEUNG KWAN O METHODIST PRIMARY SCHOOL"
      },
      {
        "name": "天主教聖安德肋小學",
        "nameEn": "ST ANDREW'S CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "西貢崇真天主教學校(小學部)",
        "nameEn": "SAI KUNG SUNG TSUN CATHOLIC SCHOOL (PRIMARY SECTION)"
      },
      {
        "name": "博愛醫院陳國威小學",
        "nameEn": "POK OI HOSPITAL CHAN KWOK WAI PRIMARY SCHOOL"
      },
      {
        "name": "基督教宣道會宣基小學",
        "nameEn": "CHRISTIAN & MISSIONARY ALLIANCE SUN KEI PRIMARY SCHOOL"
      },
      {
        "name": "佛教志蓮小學",
        "nameEn": "CHI LIN BUDDHIST PRIMARY SCHOOL"
      },
      {
        "name": "景林天主教小學",
        "nameEn": "KING LAM CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "樂善堂劉德學校",
        "nameEn": "LOK SIN TONG LAU TAK PRIMARY SCHOOL"
      },
      {
        "name": "港澳信義會小學",
        "nameEn": "HONG KONG AND MACAU LUTHERAN CHURCH PRIMARY SCHOOL"
      },
      {
        "name": "港澳信義會明道小學",
        "nameEn": "HONG KONG AND MACAU LUTHERAN CHURCH MING TAO PRIMARY SCHOOL"
      },
      {
        "name": "保良局黃永樹小學",
        "nameEn": "PO LEUNG KUK WONG WING SHU PRIMARY SCHOOL"
      },
      {
        "name": "仁愛堂田家炳小學",
        "nameEn": "YAN OI TONG TIN KA PING PRIMARY SCHOOL"
      },
      {
        "name": "東華三院王余家潔紀念小學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS WONG YEE JAR JAT MEMORIAL PRIMARY SCHOOL"
      },
      {
        "name": "基督教宣道會宣基中學",
        "nameEn": "CHRISTIAN & MISSIONARY ALLIANCE SUN KEI SECONDARY SCHOOL"
      },
      {
        "name": "新界西貢坑口區鄭植之中學",
        "nameEn": "CHENG CHEK CHEE SECONDARY SCHOOL OF SAI KUNG AND HANG HAU DISTRICT, N.T."
      },
      {
        "name": "馬錦明慈善基金馬陳端喜紀念中學",
        "nameEn": "MA KAM MING CHARITABLE FOUNDATION MA CHAN DUEN HEY MEMORIAL COLLEGE"
      },
      {
        "name": "迦密主恩中學",
        "nameEn": "CARMEL DIVINE GRACE FOUNDATION SECONDARY SCHOOL"
      },
      {
        "name": "天主教鳴遠中學",
        "nameEn": "CATHOLIC MING YUEN SECONDARY SCHOOL"
      },
      {
        "name": "仁濟醫院王華湘中學",
        "nameEn": "YAN CHAI HOSPITAL WONG WHA SAN SECONDARY SCHOOL"
      },
      {
        "name": "東華三院呂潤財紀念中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS LUI YUN CHOY MEMORIAL COLLEGE"
      },
      {
        "name": "仁濟醫院靚次伯紀念中學",
        "nameEn": "YAN CHAI HOSPITAL LAN CHI PAT MEMORIAL SECONDARY SCHOOL"
      },
      {
        "name": "威靈頓教育機構張沛松紀念中學",
        "nameEn": "WELLINGTON EDUCATION ORGANIZATION CHANG PUI CHUNG MEMORIAL SCHOOL"
      },
      {
        "name": "寶覺中學",
        "nameEn": "PO KOK SECONDARY SCHOOL"
      },
      {
        "name": "香港道教聯合會圓玄學院第三中學",
        "nameEn": "THE HONG KONG TAOIST ASSOCIATION THE YUEN YUEN INSTITUTE NO. 3 SECONDARY SCHOOL"
      },
      {
        "name": "博愛醫院八十週年鄧英喜中學",
        "nameEn": "POK OI HOSPITAL 80TH ANNIVERSARY TANG YING HEI COLLEGE"
      },
      {
        "name": "香海正覺蓮社佛教正覺中學",
        "nameEn": "HHCKLA BUDDHIST CHING KOK SECONDARY SCHOOL"
      },
      {
        "name": "西貢崇真天主教學校(中學部)",
        "nameEn": "SAI KUNG SUNG TSUN CATHOLIC SCHOOL (SECONDARY SECTION)"
      },
      {
        "name": "港澳信義會慕德中學",
        "nameEn": "HONG KONG AND MACAU LUTHERAN CHURCH QUEEN MAUD SECONDARY SCHOOL"
      },
      {
        "name": "保良局甲子何玉清中學",
        "nameEn": "PO LEUNG KUK HO YUK CHING (1984) COLLEGE"
      },
      {
        "name": "景嶺書院",
        "nameEn": "KING LING COLLEGE"
      },
      {
        "name": "順德聯誼總會鄭裕彤中學",
        "nameEn": "SHUN TAK FRATERNAL ASSOCIATION CHENG YU TUNG SECONDARY SCHOOL"
      }
    ]
  },
  "元朗區": {
    "直接資助計劃": [
      {
        "name": "基督教香港信義會宏信書院",
        "nameEn": "ELCHK LUTHERAN ACADEMY"
      },
      {
        "name": "和富慈善基金李宗德小學",
        "nameEn": "W F JOSEPH LEE PRIMARY SCHOOL"
      },
      {
        "name": "香港青年協會李兆基書院",
        "nameEn": "HKFYG LEE SHAU KEE COLLEGE"
      },
      {
        "name": "基督教香港信義會宏信書院",
        "nameEn": "ELCHK LUTHERAN ACADEMY"
      },
      {
        "name": "萬鈞伯裘書院",
        "nameEn": "MAN KWAN PAK KAU COLLEGE"
      },
      {
        "name": "中華基督教青年會中學",
        "nameEn": "CHINESE Y.M.C.A. SECONDARY SCHOOL"
      },
      {
        "name": "天水圍香島中學",
        "nameEn": "HEUNG TO MIDDLE SCHOOL (TIN SHUI WAI)"
      }
    ],
    "資助": [
      {
        "name": "基督教培恩小學",
        "nameEn": "CHRISTIAN PUI YAN PRIMARY SCHOOL"
      },
      {
        "name": "香港青年協會李兆基小學",
        "nameEn": "HKFYG LEE SHAU KEE PRIMARY SCHOOL"
      },
      {
        "name": "通德學校",
        "nameEn": "TUNG TAK SCHOOL"
      },
      {
        "name": "佛教陳榮根紀念學校",
        "nameEn": "BUDDHIST CHAN WING KAN MEMORIAL SCHOOL"
      },
      {
        "name": "中華基督教會元朗真光小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA CHUN KWONG PRIMARY SCHOOL"
      },
      {
        "name": "東華三院姚達之紀念小學(元朗)",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS YIU DAK CHI MEMORIAL PRIMARY SCHOOL (YUEN LONG)"
      },
      {
        "name": "港澳信義會黃陳淑英紀念學校",
        "nameEn": "HONG KONG AND MACAU LUTHERAN CHURCH WONG CHAN SOOK YING MEMORIAL SCHOOL"
      },
      {
        "name": "金巴崙長老會耀道小學",
        "nameEn": "CUMBERLAND PRESBYTERIAN CHURCH YAO DAO PRIMARY SCHOOL"
      },
      {
        "name": "錦田公立蒙養學校",
        "nameEn": "KAM TIN MUNG YEUNG PUBLIC SCHOOL"
      },
      {
        "name": "宣道會葉紹蔭紀念小學",
        "nameEn": "CHRISTIAN ALLIANCE S Y YEH MEMORIAL PRIMARY SCHOOL"
      },
      {
        "name": "元朗公立中學校友會小學",
        "nameEn": "YUEN LONG PUBLIC MIDDLE SCHOOL ALUMNI ASSOCIATION PRIMARY SCHOOL"
      },
      {
        "name": "十八鄉鄉事委員會公益社小學",
        "nameEn": "SHAP PAT HEUNG RURAL COMMITTEE KUNG YIK SHE PRIMARY SCHOOL"
      },
      {
        "name": "順德聯誼總會伍冕端小學",
        "nameEn": "SHUN TAK FRATERNAL ASSOCIATION WU MIEN TUEN PRIMARY SCHOOL"
      },
      {
        "name": "東華三院李東海小學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS LEO TUNG-HAI LEE PRIMARY SCHOOL"
      },
      {
        "name": "聖公會靈愛小學",
        "nameEn": "S.K.H. LING OI PRIMARY SCHOOL"
      },
      {
        "name": "八鄉中心小學",
        "nameEn": "PAT HEUNG CENTRAL PRIMARY SCHOOL"
      },
      {
        "name": "香港普通話研習社科技創意小學",
        "nameEn": "XIANGGANG PUTONGHUA YANXISHE PRIMARY SCHOOL OF SCIENCE AND CREATIVITY"
      },
      {
        "name": "樂善堂梁銶琚學校",
        "nameEn": "LOK SIN TONG LEUNG KAU KUI PRIMARY SCHOOL"
      },
      {
        "name": "鐘聲學校",
        "nameEn": "CHUNG SING SCHOOL"
      },
      {
        "name": "光明學校",
        "nameEn": "KWONG MING SCHOOL"
      },
      {
        "name": "元朗朗屏邨惠州學校",
        "nameEn": "YUEN LONG LONG PING ESTATE WAI CHOW SCHOOL"
      },
      {
        "name": "元朗公立中學校友會鄧英業小學",
        "nameEn": "YUEN LONG PUBLIC MIDDLE SCHOOL ALUMNI ASSOCIATION TANG YING YIP PRIMARY SCHOOL"
      },
      {
        "name": "基督教宣道會徐澤林紀念小學",
        "nameEn": "CHRISTIAN & MISSIONARY ALLIANCE CHUI CHAK LAM MEMORIAL SCHOOL"
      },
      {
        "name": "元朗商會小學",
        "nameEn": "YUEN LONG MERCHANTS ASSOCIATION PRIMARY SCHOOL"
      },
      {
        "name": "惇裕學校",
        "nameEn": "TUN YU SCHOOL"
      },
      {
        "name": "樂善堂梁銶琚學校(分校)",
        "nameEn": "LOK SIN TONG LEUNG KAU KUI PRIMARY SCHOOL (BRANCH)"
      },
      {
        "name": "聖公會天水圍靈愛小學",
        "nameEn": "S.K.H. TIN SHUI WAI LING OI PRIMARY SCHOOL"
      },
      {
        "name": "天水圍天主教小學",
        "nameEn": "TIN SHUI WAI CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "光明英來學校",
        "nameEn": "KWONG MING YING LOI SCHOOL"
      },
      {
        "name": "伊利沙伯中學舊生會小學",
        "nameEn": "QUEEN ELIZABETH SCHOOL OLD STUDENTS' ASSOCIATION PRIMARY SCHOOL"
      },
      {
        "name": "博愛醫院歷屆總理聯誼會梁省德學校",
        "nameEn": "THE ASSOCIATION OF THE DIRECTORS AND FORMER DIRECTORS OF POK OI HOSPITAL LTD. LEUNG SING TAK SCHOOL"
      },
      {
        "name": "潮陽百欣小學",
        "nameEn": "CHIU YANG POR YEN PRIMARY SCHOOL"
      },
      {
        "name": "伊利沙伯中學舊生會小學分校",
        "nameEn": "QUEEN ELIZABETH SCHOOL OLD STUDENTS' ASSOCIATION BRANCH PRIMARY SCHOOL"
      },
      {
        "name": "佛教榮茵學校",
        "nameEn": "BUDDHIST WING YAN SCHOOL"
      },
      {
        "name": "元朗朗屏邨東莞學校",
        "nameEn": "YUEN LONG LONG PING ESTATE TUNG KOON PRIMARY SCHOOL"
      },
      {
        "name": "聖公會聖約瑟小學",
        "nameEn": "S.K.H. ST. JOSEPH'S PRIMARY SCHOOL"
      },
      {
        "name": "香港潮陽小學",
        "nameEn": "CHIU YANG PRIMARY SCHOOL OF HONG KONG"
      },
      {
        "name": "天水圍循道衞理小學",
        "nameEn": "TIN SHUI WAI METHODIST PRIMARY SCHOOL"
      },
      {
        "name": "嗇色園主辦可銘學校",
        "nameEn": "HO MING PRIMARY SCHOOL (SPONSORED BY SIK SIK YUEN)"
      },
      {
        "name": "獅子會何德心小學",
        "nameEn": "LIONS CLUBS INTERNATIONAL HO TAK SUM PRIMARY SCHOOL"
      },
      {
        "name": "中華基督教青年會小學",
        "nameEn": "CHINESE Y.M.C.A. PRIMARY SCHOOL"
      },
      {
        "name": "元朗寶覺小學",
        "nameEn": "YUEN LONG PO KOK PRIMARY SCHOOL"
      },
      {
        "name": "伯特利中學",
        "nameEn": "BETHEL HIGH SCHOOL"
      },
      {
        "name": "東華三院盧幹庭紀念中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS LO KON TING MEMORIAL COLLEGE"
      },
      {
        "name": "聖公會白約翰會督中學",
        "nameEn": "SHENG KUNG HUI BISHOP BAKER SECONDARY SCHOOL"
      },
      {
        "name": "中華基督教會方潤華中學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA FONG YUN WAH SECONDARY SCHOOL"
      },
      {
        "name": "金巴崙長老會耀道中學",
        "nameEn": "CUMBERLAND PRESBYTERIAN CHURCH YAO DAO SECONDARY SCHOOL"
      },
      {
        "name": "元朗公立中學校友會鄧兆棠中學",
        "nameEn": "YUEN LONG PUBLIC MIDDLE SCHOOL ALUMNI ASSOCIATION TANG SIU TONG SECONDARY SCHOOL"
      },
      {
        "name": "天主教培聖中學",
        "nameEn": "PUI SHING CATHOLIC SECONDARY SCHOOL"
      },
      {
        "name": "中華基督教會基元中學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI YUEN COLLEGE"
      },
      {
        "name": "路德會西門英才中學",
        "nameEn": "GERTRUDE SIMON LUTHERAN COLLEGE"
      },
      {
        "name": "元朗商會中學",
        "nameEn": "YUEN LONG MERCHANTS ASSOCIATION SECONDARY SCHOOL"
      },
      {
        "name": "中華基督教會基朗中學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI LONG COLLEGE"
      },
      {
        "name": "天水圍循道衞理中學",
        "nameEn": "TIN SHUI WAI METHODIST COLLEGE"
      },
      {
        "name": "順德聯誼總會翁祐中學",
        "nameEn": "SHUN TAK FRATERNAL ASSOCIATION YUNG YAU COLLEGE"
      },
      {
        "name": "佛教茂峰法師紀念中學",
        "nameEn": "BUDDHIST MAU FUNG MEMORIAL COLLEGE"
      },
      {
        "name": "東華三院郭一葦中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS KWOK YAT WAI COLLEGE"
      },
      {
        "name": "東華三院馬振玉紀念中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS C.Y. MA MEMORIAL COLLEGE"
      },
      {
        "name": "香港管理專業協會羅桂祥中學",
        "nameEn": "THE HONG KONG MANAGEMENT ASSOCIATION K. S. LO COLLEGE"
      },
      {
        "name": "元朗天主教中學",
        "nameEn": "YUEN LONG CATHOLIC SECONDARY SCHOOL"
      },
      {
        "name": "明愛元朗陳震夏中學",
        "nameEn": "CARITAS YUEN LONG CHAN CHUN HA SECONDARY SCHOOL"
      },
      {
        "name": "香港中文大學校友會聯會張煊昌中學",
        "nameEn": "CUHK FEDERATION OF ALUMNI ASSOCIATIONS THOMAS CHEUNG SECONDARY SCHOOL"
      },
      {
        "name": "博愛醫院鄧佩瓊紀念中學",
        "nameEn": "POK OI HOSPITAL TANG PUI KING MEMORIAL COLLEGE"
      },
      {
        "name": "十八鄉鄉事委員會公益社中學",
        "nameEn": "SHAP PAT HEUNG RURAL COMMITTEE KUNG YIK SHE SECONDARY SCHOOL"
      },
      {
        "name": "裘錦秋中學(元朗)",
        "nameEn": "JU CHING CHU SECONDARY SCHOOL (YUEN LONG)"
      },
      {
        "name": "可道中學(嗇色園主辦)",
        "nameEn": "HO DAO COLLEGE (SPONSORED BY SIK SIK YUEN)"
      },
      {
        "name": "天主教崇德英文書院",
        "nameEn": "SHUNG TAK CATHOLIC ENGLISH COLLEGE"
      },
      {
        "name": "基督教香港信義會元朗信義中學",
        "nameEn": "THE EVANGELICAL LUTHERAN CHURCH OF HONG KONG YUEN LONG LUTHERAN SECONDARY SCHOOL"
      },
      {
        "name": "圓玄學院妙法寺內明陳呂重德紀念中學",
        "nameEn": "THE YUEN YUEN INSTITUTE MFBM NEI MING CHAN LUI CHUNG TAK MEMORIAL COLLEGE"
      },
      {
        "name": "賽馬會萬鈞毅智書院",
        "nameEn": "JOCKEY CLUB MAN KWAN EDUYOUNG COLLEGE"
      },
      {
        "name": "伊利沙伯中學舊生會湯國華中學",
        "nameEn": "QUEEN ELIZABETH SCHOOL OLD STUDENTS' ASSOCIATION TONG KWOK WAH SECONDARY SCHOOL"
      },
      {
        "name": "伊利沙伯中學舊生會中學",
        "nameEn": "QUEEN ELIZABETH SCHOOL OLD STUDENTS' ASSOCIATION SECONDARY SCHOOL"
      }
    ]
  },
  "深水埗區": {
    "直接資助計劃": [
      {
        "name": "嶺南大學香港同學會小學",
        "nameEn": "LINGNAN UNIVERSITY ALUMNI ASSOCIATION (HONG KONG) PRIMARY SCHOOL"
      },
      {
        "name": "英華小學",
        "nameEn": "YING WA PRIMARY SCHOOL"
      },
      {
        "name": "聖瑪加利男女英文中小學",
        "nameEn": "ST. MARGARET'S CO-EDUCATIONAL ENGLISH SECONDARY AND PRIMARY SCHOOL"
      },
      {
        "name": "地利亞修女紀念學校(吉利徑)",
        "nameEn": "DELIA MEMORIAL SCHOOL (GLEE PATH)"
      },
      {
        "name": "聖瑪加利男女英文中小學",
        "nameEn": "ST. MARGARET'S CO-EDUCATIONAL ENGLISH SECONDARY AND PRIMARY SCHOOL"
      },
      {
        "name": "基督教崇真中學",
        "nameEn": "TSUNG TSIN CHRISTIAN ACADEMY"
      },
      {
        "name": "地利亞修女紀念學校﹝百老匯﹞",
        "nameEn": "DELIA MEMORIAL SCHOOL (BROADWAY )"
      },
      {
        "name": "惠僑英文中學",
        "nameEn": "WAI KIU COLLEGE"
      },
      {
        "name": "中聖書院",
        "nameEn": "CHINA HOLINESS COLLEGE"
      },
      {
        "name": "英華書院",
        "nameEn": "YING WA COLLEGE"
      },
      {
        "name": "香島中學",
        "nameEn": "HEUNG TO MIDDLE SCHOOL"
      }
    ],
    "資助": [
      {
        "name": "郭怡雅神父紀念學校",
        "nameEn": "FR. CUCCHIARA MEMORIAL SCHOOL"
      },
      {
        "name": "大坑東宣道小學",
        "nameEn": "ALLIANCE PRIMARY SCHOOL, TAI HANG TUNG"
      },
      {
        "name": "長沙灣天主教小學",
        "nameEn": "CHEUNG SHA WAN CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "中華基督教會協和小學(長沙灣)",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA HEEP WOH PRIMARY SCHOOL (CHEUNG SHA WAN)"
      },
      {
        "name": "瑪利諾神父教會學校(小學部)",
        "nameEn": "MARYKNOLL FATHERS' SCHOOL (PRIMARY SECTION)"
      },
      {
        "name": "聖公會聖多馬小學",
        "nameEn": "S.K.H. ST. THOMAS' PRIMARY SCHOOL"
      },
      {
        "name": "基督教香港信義會深信學校",
        "nameEn": "THE EVANGELICAL LUTHERAN CHURCH OF HONG KONG FAITH LUTHERAN SCHOOL"
      },
      {
        "name": "基督教香港信義會深信學校",
        "nameEn": "THE EVANGELICAL LUTHERAN CHURCH OF HONG KONG FAITH LUTHERAN SCHOOL"
      },
      {
        "name": "寶血會嘉靈學校",
        "nameEn": "KA LING SCHOOL OF THE PRECIOUS BLOOD"
      },
      {
        "name": "聖方濟愛德小學",
        "nameEn": "ST. FRANCIS OF ASSISI'S CARITAS SCHOOL"
      },
      {
        "name": "香港四邑商工總會新會商會學校",
        "nameEn": "THE HONG KONG SZE YAP COMMERCIAL & INDUSTRIAL ASSOCIATION SAN WUI COMMERCIAL SOCIETY SCHOOL"
      },
      {
        "name": "聖公會基愛小學",
        "nameEn": "S.K.H. KEI OI PRIMARY SCHOOL"
      },
      {
        "name": "聖公會聖紀文小學",
        "nameEn": "S.K.H. ST. CLEMENT'S PRIMARY SCHOOL"
      },
      {
        "name": "聖公會聖安德烈小學",
        "nameEn": "S.K.H. ST. ANDREW'S PRIMARY SCHOOL"
      },
      {
        "name": "聖公會基福小學",
        "nameEn": "S.K.H. KEI FOOK PRIMARY SCHOOL"
      },
      {
        "name": "旅港開平商會學校",
        "nameEn": "HOI PING CHAMBER OF COMMERCE PRIMARY SCHOOL"
      },
      {
        "name": "深水埔街坊福利會小學",
        "nameEn": "SHAMSHUIPO KAIFONG WELFARE ASSOCIATION PRIMARY SCHOOL"
      },
      {
        "name": "天主教善導小學",
        "nameEn": "GOOD COUNSEL CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "五邑工商總會學校",
        "nameEn": "FIVE DISTRICTS BUSINESS WELFARE ASSOCIATION SCHOOL"
      },
      {
        "name": "荔枝角天主教小學",
        "nameEn": "LAICHIKOK CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "德貞女子中學",
        "nameEn": "TACK CHING GIRLS' SECONDARY SCHOOL"
      },
      {
        "name": "香港四邑商工總會黃棣珊紀念中學",
        "nameEn": "THE HONG KONG SZE YAP COMMERCIAL & INDUSTRIAL ASSOCIATION WONG TAI SHAN MEMORIAL COLLEGE"
      },
      {
        "name": "寶血會上智英文書院",
        "nameEn": "HOLY TRINITY COLLEGE"
      },
      {
        "name": "路德會協同中學",
        "nameEn": "CONCORDIA LUTHERAN SCHOOL"
      },
      {
        "name": "德雅中學",
        "nameEn": "TAK NGA SECONDARY SCHOOL"
      },
      {
        "name": "佛教大雄中學",
        "nameEn": "BUDDHIST TAI HUNG COLLEGE"
      },
      {
        "name": "聖母玫瑰書院",
        "nameEn": "OUR LADY OF THE ROSARY COLLEGE"
      },
      {
        "name": "聖公會聖馬利亞堂莫慶堯中學",
        "nameEn": "S.K.H. ST. MARY'S CHURCH MOK HING YIU COLLEGE"
      },
      {
        "name": "保良局唐乃勤初中書院",
        "nameEn": "PO LEUNG KUK TONG NAI KAN JUNIOR SECONDARY COLLEGE"
      },
      {
        "name": "廠商會中學",
        "nameEn": "CMA SECONDARY SCHOOL"
      },
      {
        "name": "中華基督教會銘賢書院",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA MING YIN COLLEGE"
      },
      {
        "name": "東華三院張明添中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS CHANG MING THIEN COLLEGE"
      },
      {
        "name": "瑪利諾神父教會學校",
        "nameEn": "MARYKNOLL FATHERS' SCHOOL"
      },
      {
        "name": "長沙灣天主教英文中學",
        "nameEn": "CHEUNG SHA WAN CATHOLIC SECONDARY SCHOOL"
      },
      {
        "name": "天主教南華中學",
        "nameEn": "NAM WAH CATHOLIC SECONDARY SCHOOL"
      }
    ],
    "按位津貼": [
      {
        "name": "滙基書院",
        "nameEn": "UNITED CHRISTIAN COLLEGE"
      }
    ]
  },
  "東區": {
    "直接資助計劃": [
      {
        "name": "漢華中學",
        "nameEn": "HON WAH COLLEGE"
      },
      {
        "name": "港大同學會小學",
        "nameEn": "HKUGA PRIMARY SCHOOL"
      },
      {
        "name": "蘇浙公學",
        "nameEn": "KIANGSU-CHEKIANG COLLEGE"
      },
      {
        "name": "培僑中學",
        "nameEn": "PUI KIU MIDDLE SCHOOL"
      },
      {
        "name": "中華基金中學",
        "nameEn": "THE CHINESE FOUNDATION SECONDARY SCHOOL"
      },
      {
        "name": "漢華中學",
        "nameEn": "HON WAH COLLEGE"
      }
    ],
    "英基學校協會": [
      {
        "name": "鰂魚涌小學",
        "nameEn": "QUARRY BAY SCHOOL"
      }
    ],
    "資助": [
      {
        "name": "天主教明德學校",
        "nameEn": "MENG TAK CATHOLIC SCHOOL"
      },
      {
        "name": "慈幼學校",
        "nameEn": "SALESIAN SCHOOL"
      },
      {
        "name": "丹拿山循道學校",
        "nameEn": "CHINESE METHODIST SCHOOL, TANNER HILL"
      },
      {
        "name": "基督教香港信義會信愛學校",
        "nameEn": "THE EVANGELICAL LUTHERAN CHURCH OF HONG KONG FAITH LOVE LUTHERAN SCHOOL"
      },
      {
        "name": "北角衞理小學",
        "nameEn": "NORTH POINT METHODIST PRIMARY SCHOOL"
      },
      {
        "name": "滬江小學",
        "nameEn": "SHANGHAI ALUMNI PRIMARY SCHOOL"
      },
      {
        "name": "筲箕灣崇真學校",
        "nameEn": "SHAUKIWAN TSUNG TSIN SCHOOL"
      },
      {
        "name": "香港中國婦女會丘佐榮學校",
        "nameEn": "THE HONG KONG CHINESE WOMEN'S CLUB HIOE TJO YOENG PRIMARY SCHOOL"
      },
      {
        "name": "佛教中華康山學校",
        "nameEn": "BUDDHIST CHUNG WAH KORNHILL PRIMARY SCHOOL"
      },
      {
        "name": "中華基督教會基灣小學(愛蝶灣)",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI WAN PRIMARY SCHOOL (ALDRICH BAY)"
      },
      {
        "name": "救世軍韋理夫人紀念學校",
        "nameEn": "THE SALVATION ARMY ANN WYLLIE MEMORIAL SCHOOL"
      },
      {
        "name": "勵志會梁李秀娛紀念小學",
        "nameEn": "THE ENDEAVOURERS LEUNG LEE SAU YU MEMORIAL PRIMARY SCHOOL"
      },
      {
        "name": "救世軍中原慈善基金學校",
        "nameEn": "THE SALVATION ARMY CENTALINE CHARITY FUND SCHOOL"
      },
      {
        "name": "中華基督教會基灣小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI WAN PRIMARY SCHOOL"
      },
      {
        "name": "聖公會柴灣聖米迦勒小學",
        "nameEn": "S.K.H. CHAI WAN ST. MICHAEL'S PRIMARY SCHOOL"
      },
      {
        "name": "番禺會所華仁小學",
        "nameEn": "PUN U ASSOCIATION WAH YAN PRIMARY SCHOOL"
      },
      {
        "name": "太古小學",
        "nameEn": "TAIKOO PRIMARY SCHOOL"
      },
      {
        "name": "香港嘉諾撒學校",
        "nameEn": "CANOSSA SCHOOL (HONG KONG)"
      },
      {
        "name": "北角循道學校",
        "nameEn": "CHINESE METHODIST SCHOOL (NORTH POINT)"
      },
      {
        "name": "培僑小學",
        "nameEn": "PUI KIU PRIMARY SCHOOL"
      },
      {
        "name": "啓基學校(港島)",
        "nameEn": "CHAN'S CREATIVE SCHOOL (HONG KONG ISLAND)"
      },
      {
        "name": "聖公會聖米迦勒小學",
        "nameEn": "S.K.H. ST. MICHAEL'S PRIMARY SCHOOL"
      },
      {
        "name": "衞理中學",
        "nameEn": "THE METHODIST CHURCH HONG KONG WESLEY COLLEGE"
      },
      {
        "name": "福建中學(小西灣)",
        "nameEn": "FUKIEN SECONDARY SCHOOL (SIU SAI WAN)"
      },
      {
        "name": "明愛柴灣馬登基金中學",
        "nameEn": "CARITAS CHAI WAN MARDEN FOUNDATION SECONDARY SCHOOL"
      },
      {
        "name": "中華傳道會劉永生中學",
        "nameEn": "CHRISTIAN NATIONALS' EVANGELISM COMMISSION LAU WING SANG SECONDARY SCHOOL"
      },
      {
        "name": "張振興伉儷書院",
        "nameEn": "CHONG GENE HANG COLLEGE"
      },
      {
        "name": "香港中國婦女會中學",
        "nameEn": "HONG KONG CHINESE WOMEN'S CLUB COLLEGE"
      },
      {
        "name": "嶺南衡怡紀念中學",
        "nameEn": "LINGNAN HANG YEE MEMORIAL SECONDARY SCHOOL"
      },
      {
        "name": "聖貞德中學",
        "nameEn": "ST. JOAN OF ARC SECONDARY SCHOOL"
      },
      {
        "name": "慈幼英文學校",
        "nameEn": "SALESIAN ENGLISH SCHOOL"
      },
      {
        "name": "嶺南中學",
        "nameEn": "LINGNAN SECONDARY SCHOOL"
      },
      {
        "name": "寶血女子中學",
        "nameEn": "PRECIOUS BLOOD SECONDARY SCHOOL"
      },
      {
        "name": "聖馬可中學",
        "nameEn": "ST. MARK'S SCHOOL"
      },
      {
        "name": "炮台山循道衛理中學",
        "nameEn": "FORTRESS HILL METHODIST SECONDARY SCHOOL"
      },
      {
        "name": "嘉諾撒書院",
        "nameEn": "CANOSSA COLLEGE"
      },
      {
        "name": "伊斯蘭脫維善紀念中學",
        "nameEn": "ISLAMIC KASIM TUET MEMORIAL COLLEGE"
      },
      {
        "name": "張祝珊英文中學",
        "nameEn": "CHEUNG CHUK SHAN COLLEGE"
      },
      {
        "name": "閩僑中學",
        "nameEn": "MAN KIU COLLEGE"
      },
      {
        "name": "文理書院(香港)",
        "nameEn": "COGNITIO COLLEGE (HONG KONG)"
      },
      {
        "name": "中華基督教會桂華山中學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KWEI WAH SHAN COLLEGE"
      },
      {
        "name": "顯理中學",
        "nameEn": "HENRIETTA SECONDARY SCHOOL"
      },
      {
        "name": "聖公會李福慶中學",
        "nameEn": "SKH LI FOOK HING SECONDARY SCHOOL"
      },
      {
        "name": "港島民生書院",
        "nameEn": "MUNSANG COLLEGE (HONG KONG ISLAND)"
      }
    ]
  },
  "油尖旺區": {
    "直接資助計劃": [
      {
        "name": "保良局陳守仁小學",
        "nameEn": "PO LEUNG KUK CAMÕES TAN SIU LIN PRIMARY SCHOOL"
      },
      {
        "name": "優才(楊殷有娣)書院",
        "nameEn": "G.T. (ELLEN YEUNG) COLLEGE"
      },
      {
        "name": "九龍三育中學",
        "nameEn": "KOWLOON SAM YUK SECONDARY SCHOOL"
      },
      {
        "name": "香港管理專業協會李國寶中學",
        "nameEn": "HKMA DAVID LI KWOK PO COLLEGE"
      },
      {
        "name": "拔萃女書院",
        "nameEn": "DIOCESAN GIRLS' SCHOOL"
      },
      {
        "name": "九龍三育中學",
        "nameEn": "KOWLOON SAM YUK SECONDARY SCHOOL"
      }
    ],
    "資助": [
      {
        "name": "中華基督教會基全小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI TSUN PRIMARY SCHOOL"
      },
      {
        "name": "循道學校",
        "nameEn": "METHODIST SCHOOL"
      },
      {
        "name": "鮮魚行學校",
        "nameEn": "FRESH FISH TRADERS' SCHOOL"
      },
      {
        "name": "九龍婦女福利會李炳紀念學校",
        "nameEn": "KOWLOON WOMEN'S WELFARE CLUB LI PING MEMORIAL SCHOOL"
      },
      {
        "name": "東華三院羅裕積小學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS LO YU CHIK PRIMARY SCHOOL"
      },
      {
        "name": "聖公會基榮小學",
        "nameEn": "S.K.H. KEI WING PRIMARY SCHOOL"
      },
      {
        "name": "中華基督教會協和小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA HEEP WOH PRIMARY SCHOOL"
      },
      {
        "name": "油蔴地天主教小學(海泓道)",
        "nameEn": "YAUMATI CATHOLIC PRIMARY SCHOOL (HOI WANG ROAD)"
      },
      {
        "name": "德信學校",
        "nameEn": "TAK SUN SCHOOL"
      },
      {
        "name": "大角嘴天主教小學",
        "nameEn": "TAI KOK TSUI CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "油蔴地街坊會學校",
        "nameEn": "YAUMATI KAIFONG ASSOCIATION SCHOOL"
      },
      {
        "name": "油蔴地天主教小學",
        "nameEn": "YAUMATI CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "大角嘴天主教小學(海帆道)",
        "nameEn": "TAI KOK TSUI CATHOLIC PRIMARY SCHOOL (HOI FAN ROAD)"
      },
      {
        "name": "路德會沙崙學校",
        "nameEn": "SHARON LUTHERAN SCHOOL"
      },
      {
        "name": "嘉諾撒聖瑪利學校",
        "nameEn": "ST. MARY'S CANOSSIAN SCHOOL"
      },
      {
        "name": "東莞同鄉會方樹泉學校",
        "nameEn": "TUNG KOON DISTRICT SOCIETY FONG SHU CHUEN SCHOOL"
      },
      {
        "name": "中華基督教會灣仔堂基道小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA WANCHAI CHURCH KEI TO PRIMARY SCHOOL"
      },
      {
        "name": "世界龍岡學校劉皇發中學",
        "nameEn": "LUNG KONG WORLD FEDERATION SCHOOL LIMITED LAU WONG FAT SECONDARY SCHOOL"
      },
      {
        "name": "聖芳濟書院",
        "nameEn": "ST. FRANCIS XAVIER'S COLLEGE"
      },
      {
        "name": "基督教香港信義會信義中學",
        "nameEn": "ELCHK LUTHERAN SECONDARY SCHOOL"
      },
      {
        "name": "中華基督教會銘基書院",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA MING KEI COLLEGE"
      },
      {
        "name": "天主教新民書院",
        "nameEn": "NEWMAN CATHOLIC COLLEGE"
      },
      {
        "name": "循道中學",
        "nameEn": "METHODIST COLLEGE"
      },
      {
        "name": "華仁書院(九龍)",
        "nameEn": "WAH YAN COLLEGE, KOWLOON"
      },
      {
        "name": "麗澤中學",
        "nameEn": "LAI CHACK MIDDLE SCHOOL"
      },
      {
        "name": "保良局莊啓程預科書院",
        "nameEn": "PO LEUNG KUK VICWOOD K.T. CHONG SIXTH FORM COLLEGE"
      },
      {
        "name": "真光女書院",
        "nameEn": "TRUE LIGHT GIRLS' COLLEGE"
      },
      {
        "name": "港九潮州公會中學",
        "nameEn": "HONG KONG & KOWLOON CHIU CHOW PUBLIC ASSOCIATION SECONDARY SCHOOL"
      },
      {
        "name": "嘉諾撒聖瑪利書院",
        "nameEn": "ST. MARY'S CANOSSIAN COLLEGE"
      },
      {
        "name": "麗澤中學",
        "nameEn": "LAI CHACK MIDDLE SCHOOL"
      }
    ],
    "按位津貼": [
      {
        "name": "聖公會諸聖中學",
        "nameEn": "S.K.H. ALL SAINTS' MIDDLE SCHOOL"
      }
    ]
  },
  "屯門區": {
    "直接資助計劃": [
      {
        "name": "保良局香港道教聯合會圓玄小學",
        "nameEn": "PO LEUNG KUK HONG KONG TAOIST ASSOCIATION YUEN YUEN PRIMARY SCHOOL"
      }
    ],
    "資助": [
      {
        "name": "仁愛堂劉皇發夫人小學",
        "nameEn": "YAN OI TONG MADAM LAU WONG FAT PRIMARY SCHOOL"
      },
      {
        "name": "中華基督教會蒙黃花沃紀念小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA MONG WONG FAR YOK MEMORIAL PRIMARY SCHOOL"
      },
      {
        "name": "路德會呂祥光小學",
        "nameEn": "LUI CHEUNG KWONG LUTHERAN PRIMARY SCHOOL"
      },
      {
        "name": "道教青松小學",
        "nameEn": "TAOIST CHING CHUNG PRIMARY SCHOOL"
      },
      {
        "name": "柏立基教育學院校友會何壽基學校",
        "nameEn": "SIR ROBERT BLACK COLLEGE OF EDUCATION PAST STUDENTS' ASSOCIATION HO SAU KI SCHOOL"
      },
      {
        "name": "台山商會學校",
        "nameEn": "TOI SHAN ASSOCIATION PRIMARY SCHOOL"
      },
      {
        "name": "保良局西區婦女福利會馮李佩瑤小學",
        "nameEn": "PO LEUNG KUK WOMEN'S WELFARE CLUB WESTERN DISTRICT FUNG LEE PUI YIU PRIMARY SCHOOL"
      },
      {
        "name": "順德聯誼總會李金小學",
        "nameEn": "SHUN TAK FRATERNAL ASSOCIATION LEE KAM PRIMARY SCHOOL"
      },
      {
        "name": "道教青松小學(湖景邨)",
        "nameEn": "TAOIST CHING CHUNG PRIMARY SCHOOL (WU KING ESTATE)"
      },
      {
        "name": "博愛醫院歷屆總理聯誼會鄭任安夫人學校",
        "nameEn": "THE ASSOCIATION OF DIRECTORS & FORMER DIRECTORS OF POK OI HOSPITAL LTD MRS CHENG YAM ON SCHOOL"
      },
      {
        "name": "聖公會蒙恩小學",
        "nameEn": "S.K.H. MUNG YAN PRIMARY SCHOOL"
      },
      {
        "name": "中華基督教會拔臣小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA BUT SAN PRIMARY SCHOOL"
      },
      {
        "name": "僑港伍氏宗親會伍時暢紀念學校",
        "nameEn": "THE HONG KONG ENG CLANSMAN ASSOCIATION WU SI CHONG MEMORIAL SCHOOL"
      },
      {
        "name": "仁濟醫院羅陳楚思小學",
        "nameEn": "YAN CHAI HOSPITAL LAW CHAN CHOR SI PRIMARY SCHOOL"
      },
      {
        "name": "伊斯蘭學校",
        "nameEn": "ISLAMIC PRIMARY SCHOOL"
      },
      {
        "name": "博愛醫院歷屆總理聯誼會鄭任安夫人千禧小學",
        "nameEn": "AD&FD OF POK OI HOSPITAL MRS CHENG YAM ON MILLENNIUM SCHOOL"
      },
      {
        "name": "青山天主教小學",
        "nameEn": "CASTLE PEAK CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "世界龍岡學校劉德容紀念小學",
        "nameEn": "LUNG KONG WORLD FEDERATION SCHOOL LIMITED LAU TAK YUNG MEMORIAL PRIMARY SCHOOL"
      },
      {
        "name": "香港路德會增城兆霖學校",
        "nameEn": "LUTHERAN TSANG SHING SIU LEUN SCHOOL"
      },
      {
        "name": "五邑鄒振猷學校",
        "nameEn": "FIVE DISTRICTS BUSINESS WELFARE ASSOCIATION CHOW CHIN YAU SCHOOL"
      },
      {
        "name": "東華三院鄧肇堅小學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS TANG SHIU KIN PRIMARY SCHOOL"
      },
      {
        "name": "保良局梁周順琴小學",
        "nameEn": "PO LEUNG KUK LEUNG CHOW SHUN KAM PRIMARY SCHOOL"
      },
      {
        "name": "中華基督教會何福堂小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA HOH FUK TONG PRIMARY SCHOOL"
      },
      {
        "name": "保良局方王錦全小學",
        "nameEn": "PO LEUNG KUK FONG WONG KAM CHUEN PRIMARY SCHOOL"
      },
      {
        "name": "仁德天主教小學",
        "nameEn": "YAN TAK CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "順德聯誼總會何日東小學",
        "nameEn": "SHUN TAK FRATERNAL ASSOCIATION HO YAT TUNG PRIMARY SCHOOL"
      },
      {
        "name": "順德聯誼總會胡少渠紀念小學",
        "nameEn": "SHUN TAK FRATERNAL ASSOCIATION WU SIU KUI MEMORIAL PRIMARY SCHOOL"
      },
      {
        "name": "香港紅卍字會屯門卍慈小學",
        "nameEn": "HONG KONG RED SWASTIKA SOCIETY TUEN MUN PRIMARY SCHOOL"
      },
      {
        "name": "保良局志豪小學",
        "nameEn": "PO LEUNG KUK HORIZON EAST PRIMARY SCHOOL"
      },
      {
        "name": "圓玄學院陳國超興德小學",
        "nameEn": "THE YUEN YUEN INSTITUTE CHAN KWOK CHIU HING TAK PRIMARY SCHOOL"
      },
      {
        "name": "保良局莊啓程第二小學",
        "nameEn": "PO LEUNG KUK VICWOOD K.T. CHONG NO.2 PRIMARY SCHOOL"
      },
      {
        "name": "樂善堂梁黃蕙芳紀念學校",
        "nameEn": "LOK SIN TONG LEUNG WONG WAI FONG MEMORIAL SCHOOL"
      },
      {
        "name": "仁濟醫院何式南小學",
        "nameEn": "YAN CHAI HOSPITAL HO SIK NAM PRIMARY SCHOOL"
      },
      {
        "name": "保良局董玉娣中學",
        "nameEn": "PO LEUNG KUK TANG YUK TIEN COLLEGE"
      },
      {
        "name": "仁愛堂陳黃淑芳紀念中學",
        "nameEn": "YAN OI TONG CHAN WONG SUK FONG MEMORIAL SECONDARY SCHOOL"
      },
      {
        "name": "保良局百周年李兆忠紀念中學",
        "nameEn": "PO LEUNG KUK CENTENARY LI SHIU CHUNG MEMORIAL COLLEGE"
      },
      {
        "name": "佛教沈香林紀念中學",
        "nameEn": "BUDDHIST SUM HEUNG LAM MEMORIAL COLLEGE"
      },
      {
        "name": "迦密唐賓南紀念中學",
        "nameEn": "CARMEL BUNNAN TONG MEMORIAL SECONDARY SCHOOL"
      },
      {
        "name": "嗇色園主辦可藝中學",
        "nameEn": "HO NGAI COLLEGE (SPONSORED BY SIK SIK YUEN)"
      },
      {
        "name": "裘錦秋中學﹝屯門﹞",
        "nameEn": "JU CHING CHU SECONDARY SCHOOL (TUEN MUN)"
      },
      {
        "name": "新會商會中學",
        "nameEn": "SAN WUI COMMERCIAL SOCIETY SECONDARY SCHOOL"
      },
      {
        "name": "恩平工商會李琳明中學",
        "nameEn": "YAN PING INDUSTRIAL & COMMERCIAL ASSOCIATION LEE LIM MING COLLEGE"
      },
      {
        "name": "順德聯誼總會梁銶琚中學",
        "nameEn": "SHUN TAK FRATERNAL ASSOCIATION LEUNG KAU KUI COLLEGE"
      },
      {
        "name": "鐘聲慈善社胡陳金枝中學",
        "nameEn": "CHUNG SING BENEVOLENT SOCIETY MRS. AW BOON HAW SECONDARY SCHOOL"
      },
      {
        "name": "新生命教育協會平安福音中學",
        "nameEn": "NLSI PEACE EVANGELICAL SECONDARY SCHOOL"
      },
      {
        "name": "聖公會聖西門呂明才中學",
        "nameEn": "S.K.H. ST. SIMON'S LUI MING CHOI SECONDARY SCHOOL"
      },
      {
        "name": "妙法寺劉金龍中學",
        "nameEn": "MADAM LAU KAM LUNG SECONDARY SCHOOL OF MIU FAT BUDDHIST MONASTERY"
      },
      {
        "name": "加拿大神召會嘉智中學",
        "nameEn": "PAOC KA CHI SECONDARY SCHOOL"
      },
      {
        "name": "東華三院邱子田紀念中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS YAU TZE TIN MEMORIAL COLLEGE"
      },
      {
        "name": "中華基督教會何福堂書院",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA HOH FUK TONG COLLEGE"
      },
      {
        "name": "明愛屯門馬登基金中學",
        "nameEn": "CARITAS TUEN MUN MARDEN FOUNDATION SECONDARY SCHOOL"
      },
      {
        "name": "中華基督教會譚李麗芬紀念中學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA TAM LEE LAI FUN MEMORIAL SECONDARY SCHOOL"
      },
      {
        "name": "香海正覺蓮社佛教梁植偉中學",
        "nameEn": "HHCKLA BUDDHIST LEUNG CHIK WAI COLLEGE"
      },
      {
        "name": "順德聯誼總會譚伯羽中學",
        "nameEn": "SHUN TAK FRATERNAL ASSOCIATION TAM PAK YU COLLEGE"
      },
      {
        "name": "青松侯寶垣中學",
        "nameEn": "CHING CHUNG HAU PO WOON SECONDARY SCHOOL"
      },
      {
        "name": "馬錦明慈善基金馬可賓紀念中學",
        "nameEn": "STEWARDS MA KAM MING CHARITABLE FOUNDATION MA KO PAN MEMORIAL COLLEGE"
      },
      {
        "name": "深培中學",
        "nameEn": "SEMPLE MEMORIAL SECONDARY SCHOOL"
      },
      {
        "name": "浸信會永隆中學",
        "nameEn": "BAPTIST WING LUNG SECONDARY SCHOOL"
      },
      {
        "name": "崇真書院",
        "nameEn": "TSUNG TSIN COLLEGE"
      },
      {
        "name": "東華三院鄺錫坤伉儷中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS MR & MRS KWONG SIK KWAN COLLEGE"
      },
      {
        "name": "路德會呂祥光中學",
        "nameEn": "LUI CHEUNG KWONG LUTHERAN COLLEGE"
      },
      {
        "name": "東華三院辛亥年總理中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS SUN HOI DIRECTORS' COLLEGE"
      },
      {
        "name": "香港九龍塘基督教中華宣道會陳瑞芝紀念中學",
        "nameEn": "CHRISTIAN ALLIANCE S. C. CHAN MEMORIAL COLLEGE"
      },
      {
        "name": "仁愛堂田家炳中學",
        "nameEn": "YAN OI TONG TIN KA PING SECONDARY SCHOOL"
      },
      {
        "name": "仁濟醫院第二中學",
        "nameEn": "YAN CHAI HOSPITAL NO. 2 SECONDARY SCHOOL"
      },
      {
        "name": "廠商會蔡章閣中學",
        "nameEn": "CMA CHOI CHEUNG KOK SECONDARY SCHOOL"
      },
      {
        "name": "宣道中學",
        "nameEn": "CHRISTIAN ALLIANCE COLLEGE"
      },
      {
        "name": "屯門天主教中學",
        "nameEn": "TUEN MUN CATHOLIC SECONDARY SCHOOL"
      }
    ]
  },
  "葵青區": {
    "直接資助計劃": [
      {
        "name": "地利亞(閩僑)英文小學",
        "nameEn": "DELIA (MAN KIU) ENGLISH PRIMARY SCHOOL"
      }
    ],
    "資助": [
      {
        "name": "東華三院高可寧紀念小學",
        "nameEn": "T.W.G.HS KO HO NING MEMORIAL PRIMARY SCHOOL"
      },
      {
        "name": "亞斯理衛理小學",
        "nameEn": "ASBURY METHODIST PRIMARY SCHOOL"
      },
      {
        "name": "聖公會青衣主恩小學",
        "nameEn": "S.K.H. TSING YI CHU YAN PRIMARY SCHOOL"
      },
      {
        "name": "聖公會主恩小學",
        "nameEn": "S.K.H. CHU YAN PRIMARY SCHOOL"
      },
      {
        "name": "中華傳道會呂明才小學",
        "nameEn": "CNEC LUI MING CHOI PRIMARY SCHOOL"
      },
      {
        "name": "聖公會仁立紀念小學",
        "nameEn": "S.K.H. YAN LAAP MEMORIAL PRIMARY SCHOOL"
      },
      {
        "name": "仁濟醫院趙曾學韞小學",
        "nameEn": "YAN CHAI HOSPITAL CHIU TSANG HOK WAN PRIMARY SCHOOL"
      },
      {
        "name": "柏立基教育學院校友會盧光輝紀念學校",
        "nameEn": "SIR ROBERT BLACK COLLEGE OF EDUCATION PAST STUDENTS' ASSOCIATION LU KWONG FAI MEMORIAL SCHOOL"
      },
      {
        "name": "石籬聖若望天主教小學",
        "nameEn": "SHEK LEI ST. JOHN'S CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "中華基督教會全完第二小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA CHUEN YUEN SECOND PRIMARY SCHOOL"
      },
      {
        "name": "佛教林炳炎紀念學校(香港佛教聯合會主辦)",
        "nameEn": "BUDDHIST LAM BING YIM MEMORIAL SCHOOL (SPONSORED BY THE HONG KONG BUDDHIST ASSOCIATION)"
      },
      {
        "name": "青衣商會小學",
        "nameEn": "TSING YI TRADE ASSOCIATION PRIMARY SCHOOL"
      },
      {
        "name": "聖公會何澤芸小學",
        "nameEn": "S.K.H. HO CHAK WAN PRIMARY SCHOOL"
      },
      {
        "name": "荃灣商會學校",
        "nameEn": "TSUEN WAN TRADE ASSOCIATION PRIMARY SCHOOL"
      },
      {
        "name": "慈幼葉漢小學",
        "nameEn": "SALESIAN YIP HON PRIMARY SCHOOL"
      },
      {
        "name": "聖公會青衣邨何澤芸小學",
        "nameEn": "S.K.H. TSING YI ESTATE HO CHAK WAN PRIMARY SCHOOL"
      },
      {
        "name": "中華傳道會許大同學校",
        "nameEn": "CNEC TA TUNG SCHOOL"
      },
      {
        "name": "石籬天主教小學",
        "nameEn": "SHEK LEI CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "保良局世德小學",
        "nameEn": "PO LEUNG KUK CASTAR PRIMARY SCHOOL"
      },
      {
        "name": "佛教林金殿紀念小學",
        "nameEn": "BUDDHIST LIM KIM TIAN MEMORIAL PRIMARY SCHOOL"
      },
      {
        "name": "東華三院周演森小學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS CHOW YIN SUM PRIMARY SCHOOL"
      },
      {
        "name": "中華基督教會基真小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI CHUN PRIMARY SCHOOL"
      },
      {
        "name": "祖堯天主教小學",
        "nameEn": "CHO YIU CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "保良局陳溢小學",
        "nameEn": "PO LEUNG KUK CHAN YAT PRIMARY SCHOOL"
      },
      {
        "name": "慈幼葉漢千禧小學",
        "nameEn": "SALESIAN YIP HON MILLENNIUM PRIMARY SCHOOL"
      },
      {
        "name": "聖公會仁立小學",
        "nameEn": "S.K.H. YAN LAAP PRIMARY SCHOOL"
      },
      {
        "name": "聖公會主愛小學",
        "nameEn": "S.K.H. CHU OI PRIMARY SCHOOL"
      },
      {
        "name": "東華三院黃士心小學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS WONG SEE SUM PRIMARY SCHOOL"
      },
      {
        "name": "基督教香港信義會葵盛信義學校",
        "nameEn": "THE EVANGELICAL LUTHERAN CHURCH OF HONG KONG KWAI SHING LUTHERAN PRIMARY SCHOOL"
      },
      {
        "name": "中華傳道會李賢堯紀念中學",
        "nameEn": "CNEC LEE I YAO MEMORIAL SECONDARY SCHOOL"
      },
      {
        "name": "東華三院吳祥川紀念中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS S.C. GAW MEMORIAL COLLEGE"
      },
      {
        "name": "天主教母佑會蕭明中學",
        "nameEn": "DAUGHTERS OF MARY HELP OF CHRISTIANS SIU MING CATHOLIC SECONDARY SCHOOL"
      },
      {
        "name": "獅子會蔣翠琼中學",
        "nameEn": "LIONS CLUBS INTERNATIONAL TSEUNG CHUI KING COLLEGE"
      },
      {
        "name": "石籬天主教中學",
        "nameEn": "SHEK LEI CATHOLIC SECONDARY SCHOOL"
      },
      {
        "name": "嶺南鍾榮光博士紀念中學",
        "nameEn": "LINGNAN DR. CHUNG WING KWONG MEMORIAL SECONDARY SCHOOL"
      },
      {
        "name": "葵涌循道中學",
        "nameEn": "KWAI CHUNG METHODIST COLLEGE"
      },
      {
        "name": "佛教葉紀南紀念中學",
        "nameEn": "BUDDHIST YIP KEI NAM MEMORIAL COLLEGE"
      },
      {
        "name": "中華傳道會安柱中學",
        "nameEn": "CNEC CHRISTIAN COLLEGE"
      },
      {
        "name": "東華三院陳兆民中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS CHEN ZAO MEN COLLEGE"
      },
      {
        "name": "天主教慈幼會伍少梅中學",
        "nameEn": "SALESIANS OF DON BOSCO NG SIU MUI SECONDARY SCHOOL"
      },
      {
        "name": "裘錦秋中學(葵涌)",
        "nameEn": "JU CHING CHU SECONDARY SCHOOL (KWAI CHUNG)"
      },
      {
        "name": "聖公會林護紀念中學",
        "nameEn": "S.K.H. LAM WOO MEMORIAL SECONDARY SCHOOL"
      },
      {
        "name": "中華基督教會燕京書院",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA YENCHING COLLEGE"
      },
      {
        "name": "棉紡會中學",
        "nameEn": "COTTON SPINNERS ASSOCIATION SECONDARY SCHOOL"
      },
      {
        "name": "香港四邑商工總會陳南昌紀念中學",
        "nameEn": "THE HONG KONG S.Y.C. & I.A. CHAN NAM CHONG MEMORIAL COLLEGE"
      },
      {
        "name": "李惠利中學",
        "nameEn": "THE METHODIST LEE WAI LEE COLLEGE"
      },
      {
        "name": "中華基督教會全完中學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA CHUEN YUEN COLLEGE"
      },
      {
        "name": "香港道教聯合會圓玄學院第一中學",
        "nameEn": "HONG KONG TAOIST ASSOCIATION THE YUEN YUEN INSTITUTE NO.1 SECONDARY SCHOOL"
      },
      {
        "name": "葵涌蘇浙公學",
        "nameEn": "KIANGSU-CHEKIANG COLLEGE (KWAI CHUNG)"
      },
      {
        "name": "樂善堂顧超文中學",
        "nameEn": "LOK SIN TONG KU CHIU MAN SECONDARY SCHOOL"
      },
      {
        "name": "東華三院伍若瑜夫人紀念中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS MRS. WU YORK YU MEMORIAL COLLEGE"
      },
      {
        "name": "樂善堂梁植偉紀念中學",
        "nameEn": "LOK SIN TONG LEUNG CHIK WAI MEMORIAL SCHOOL"
      },
      {
        "name": "順德聯誼總會李兆基中學",
        "nameEn": "SHUN TAK FRATERNAL ASSOCIATION LEE SHAU KEE COLLEGE"
      },
      {
        "name": "皇仁舊生會中學",
        "nameEn": "QUEEN'S COLLEGE OLD BOYS' ASSOCIATION SECONDARY SCHOOL"
      },
      {
        "name": "保良局羅傑承(一九八三)中學",
        "nameEn": "PO LEUNG KUK LO KIT SING (1983) COLLEGE"
      },
      {
        "name": "明愛聖若瑟中學",
        "nameEn": "CARITAS ST. JOSEPH SECONDARY SCHOOL"
      },
      {
        "name": "迦密愛禮信中學",
        "nameEn": "CARMEL ALISON LAM FOUNDATION SECONDARY SCHOOL"
      },
      {
        "name": "保祿六世書院",
        "nameEn": "POPE PAUL VI COLLEGE"
      },
      {
        "name": "佛教善德英文中學",
        "nameEn": "BUDDHIST SIN TAK COLLEGE"
      },
      {
        "name": "荔景天主教中學",
        "nameEn": "LAI KING CATHOLIC SECONDARY SCHOOL"
      }
    ]
  },
  "中西區": {
    "英基學校協會": [
      {
        "name": "己連拿小學",
        "nameEn": "GLENEALY SCHOOL"
      },
      {
        "name": "PEAK SCHOOL",
        "nameEn": "PEAK SCHOOL"
      },
      {
        "name": "ISLAND SCHOOL",
        "nameEn": "ISLAND SCHOOL"
      }
    ],
    "資助": [
      {
        "name": "嘉諾撒聖心學校",
        "nameEn": "SACRED HEART CANOSSIAN SCHOOL"
      },
      {
        "name": "聖士提反女子中學附屬小學",
        "nameEn": "ST. STEPHEN'S GIRLS' PRIMARY SCHOOL"
      },
      {
        "name": "天主教總堂區學校",
        "nameEn": "CATHOLIC MISSION SCHOOL"
      },
      {
        "name": "聖公會聖彼得小學",
        "nameEn": "S.K.H. ST. PETER'S PRIMARY SCHOOL"
      },
      {
        "name": "新會商會學校",
        "nameEn": "SAN WUI COMMERCIAL SOCIETY SCHOOL"
      },
      {
        "name": "聖公會聖馬太小學",
        "nameEn": "S.K.H. ST. MATTHEW'S PRIMARY SCHOOL"
      },
      {
        "name": "中西區聖安多尼學校",
        "nameEn": "CENTRAL & WESTERN DISTRICT ST. ANTHONY'S SCHOOL"
      },
      {
        "name": "嘉諾撒聖心學校",
        "nameEn": "SACRED HEART CANOSSIAN SCHOOL"
      },
      {
        "name": "聖安多尼學校",
        "nameEn": "ST. ANTHONY'S SCHOOL"
      },
      {
        "name": "聖公會基恩小學",
        "nameEn": "S.K.H. KEI YAN PRIMARY SCHOOL"
      },
      {
        "name": "香港潮商學校",
        "nameEn": "CHIU SHEUNG SCHOOL, HONG KONG"
      },
      {
        "name": "聖嘉祿學校",
        "nameEn": "ST CHARLES SCHOOL"
      },
      {
        "name": "英皇書院同學會小學第二校",
        "nameEn": "KING'S COLLEGE OLD BOYS' ASSOCIATION PRIMARY SCHOOL NO. 2"
      },
      {
        "name": "英皇書院同學會小學",
        "nameEn": "KING'S COLLEGE OLD BOYS' ASSOCIATION PRIMARY SCHOOL"
      },
      {
        "name": "聖公會呂明才紀念小學",
        "nameEn": "S.K.H. LUI MING CHOI MEMORIAL PRIMARY SCHOOL"
      },
      {
        "name": "英華女學校",
        "nameEn": "YING WA GIRLS' SCHOOL"
      },
      {
        "name": "聖士提反堂中學",
        "nameEn": "ST. STEPHEN'S CHURCH COLLEGE"
      },
      {
        "name": "英華女學校",
        "nameEn": "YING WA GIRLS' SCHOOL"
      },
      {
        "name": "聖若瑟書院",
        "nameEn": "ST. JOSEPH'S COLLEGE"
      },
      {
        "name": "樂善堂梁銶琚書院",
        "nameEn": "LOK SIN TONG LEUNG KAU KUI COLLEGE"
      },
      {
        "name": "高主教書院",
        "nameEn": "RAIMONDI COLLEGE"
      },
      {
        "name": "聖士提反女子中學",
        "nameEn": "ST STEPHEN'S GIRLS' COLLEGE"
      },
      {
        "name": "聖士提反堂中學",
        "nameEn": "ST. STEPHEN'S CHURCH COLLEGE"
      },
      {
        "name": "聖類斯中學",
        "nameEn": "ST. LOUIS SCHOOL"
      },
      {
        "name": "聖嘉勒女書院",
        "nameEn": "ST. CLARE'S GIRLS' SCHOOL"
      }
    ],
    "直接資助計劃": [
      {
        "name": "聖保羅書院",
        "nameEn": "ST. PAUL'S COLLEGE"
      },
      {
        "name": "聖保羅男女中學",
        "nameEn": "ST. PAUL'S CO-EDUCATIONAL COLLEGE"
      }
    ]
  },
  "灣仔區": {
    "英基學校協會": [
      {
        "name": "白普理小學",
        "nameEn": "BRADBURY SCHOOL"
      }
    ],
    "資助": [
      {
        "name": "李陞大坑學校",
        "nameEn": "LI SING TAI HANG SCHOOL"
      },
      {
        "name": "寶覺小學",
        "nameEn": "PO KOK PRIMARY SCHOOL"
      },
      {
        "name": "寶血小學",
        "nameEn": "PRECIOUS BLOOD PRIMARY SCHOOL"
      },
      {
        "name": "佛教黃焯菴小學",
        "nameEn": "BUDDHIST WONG CHEUK UM PRIMARY SCHOOL"
      },
      {
        "name": "嘉諾撒聖方濟各學校",
        "nameEn": "ST. FRANCIS' CANOSSIAN SCHOOL"
      },
      {
        "name": "聖若瑟小學",
        "nameEn": "ST. JOSEPH'S PRIMARY SCHOOL"
      },
      {
        "name": "聖公會聖雅各小學",
        "nameEn": "S.K.H. ST. JAMES' PRIMARY SCHOOL"
      },
      {
        "name": "瑪利曼小學",
        "nameEn": "MARYMOUNT PRIMARY SCHOOL"
      },
      {
        "name": "保良局金銀業貿易場張凝文學校",
        "nameEn": "PO LEUNG KUK GOLD & SILVER EXCHANGE SOCIETY PERSHING TSANG SCHOOL"
      },
      {
        "name": "東華三院李賜豪小學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS LI CHI HO PRIMARY SCHOOL"
      },
      {
        "name": "聖保祿天主教小學",
        "nameEn": "ST. PAUL'S PRIMARY CATHOLIC SCHOOL"
      },
      {
        "name": "佛教黃鳳翎中學",
        "nameEn": "BUDDHIST WONG FUNG LING COLLEGE"
      },
      {
        "name": "香港華仁書院",
        "nameEn": "WAH YAN COLLEGE, HONG KONG"
      },
      {
        "name": "香港真光中學",
        "nameEn": "THE TRUE LIGHT SCHOOL OF HONG KONG"
      },
      {
        "name": "瑪利曼中學",
        "nameEn": "MARYMOUNT SECONDARY SCHOOL"
      },
      {
        "name": "嘉諾撒聖方濟各書院",
        "nameEn": "ST. FRANCIS' CANOSSIAN COLLEGE"
      },
      {
        "name": "聖保祿中學",
        "nameEn": "ST. PAUL'S SECONDARY SCHOOL"
      },
      {
        "name": "香港鄧鏡波書院",
        "nameEn": "HONG KONG TANG KING PO COLLEGE"
      },
      {
        "name": "聖公會鄧肇堅中學",
        "nameEn": "SHENG KUNG HUI TANG SHIU KIN SECONDARY SCHOOL"
      },
      {
        "name": "東華三院李潤田紀念中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS LEE CHING DEA MEMORIAL COLLEGE"
      },
      {
        "name": "北角協同中學",
        "nameEn": "CONCORDIA LUTHERAN SCHOOL - NORTH POINT"
      },
      {
        "name": "瑪利曼中學",
        "nameEn": "MARYMOUNT SECONDARY SCHOOL"
      }
    ],
    "直接資助計劃": [
      {
        "name": "孔聖堂禮仁書院",
        "nameEn": "ACADEMY OF INNOVATION (CONFUCIUS HALL)"
      },
      {
        "name": "中華基督教會公理書院",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KUNG LEE COLLEGE"
      },
      {
        "name": "聖保祿學校",
        "nameEn": "ST. PAUL'S CONVENT SCHOOL"
      }
    ]
  },
  "荃灣區": {
    "資助": [
      {
        "name": "荃灣公立何傳耀紀念小學",
        "nameEn": "TSUEN WAN PUBLIC HO CHUEN YIU MEMORIAL PRIMARY SCHOOL"
      },
      {
        "name": "中華基督教會全完第一小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA CHUEN YUEN FIRST PRIMARY SCHOOL"
      },
      {
        "name": "深井天主教小學",
        "nameEn": "SHAM TSENG CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "天佑小學",
        "nameEn": "MARY OF PROVIDENCE PRIMARY SCHOOL"
      },
      {
        "name": "梨木樹天主教小學",
        "nameEn": "LEI MUK SHUE CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "荃灣潮州公學",
        "nameEn": "TSUEN WAN CHIU CHOW PUBLIC SCHOOL"
      },
      {
        "name": "聖公會主愛小學(梨木樹)",
        "nameEn": "S.K.H. CHU OI PRIMARY SCHOOL (LEI MUK SHUE)"
      },
      {
        "name": "柴灣角天主教小學",
        "nameEn": "CHAI WAN KOK CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "香港浸信會聯會小學",
        "nameEn": "HONG KONG BAPTIST CONVENTION PRIMARY SCHOOL"
      },
      {
        "name": "寶血會思源學校",
        "nameEn": "SI YUAN SCHOOL OF THE PRECIOUS BLOOD"
      },
      {
        "name": "中華基督教會基慧小學(馬灣)",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI WAI PRIMARY SCHOOL (MA WAN)"
      },
      {
        "name": "寶血會伍季明紀念學校",
        "nameEn": "KWAI-MING WU MEMORIAL SCHOOL OF THE PRECIOUS BLOOD"
      },
      {
        "name": "中華基督教會基慧小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI WAI PRIMARY SCHOOL"
      },
      {
        "name": "嗇色園主辦可信學校",
        "nameEn": "HO SHUN PRIMARY SCHOOL (SPONSORED BY THE SIK SIK YUEN)"
      },
      {
        "name": "香港道教聯合會圓玄學院石圍角小學",
        "nameEn": "HONG KONG TAOIST ASSOCIATION THE YUEN YUEN INSTITUTE SHEK WAI KOK PRIMARY SCHOOL"
      },
      {
        "name": "靈光小學",
        "nameEn": "EMMANUEL PRIMARY SCHOOL"
      },
      {
        "name": "路德會聖十架學校",
        "nameEn": "HOLY CROSS LUTHERAN SCHOOL"
      },
      {
        "name": "荃灣天主教小學",
        "nameEn": "TSUEN WAN CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "天主教石鐘山紀念小學",
        "nameEn": "SHAK CHUNG SHAN MEMORIAL CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "荃灣公立何傳耀紀念中學",
        "nameEn": "TSUEN WAN PUBLIC HO CHUEN YIU MEMORIAL COLLEGE"
      },
      {
        "name": "紡織學會美國商會胡漢輝中學",
        "nameEn": "TEXTILE INSTITUTE AMERICAN CHAMBER OF COMMERCE WOO HON FAI SECONDARY SCHOOL"
      },
      {
        "name": "博愛醫院歷屆總理聯誼會梁省德中學",
        "nameEn": "THE ASSOCIATION OF DIRECTORS & FORMER DIRECTORS OF POK OI HOSPITAL LTD. LEUNG SING TAK COLLEGE"
      },
      {
        "name": "路德會呂明才中學",
        "nameEn": "LUI MING CHOI LUTHERAN COLLEGE"
      },
      {
        "name": "可風中學(嗇色園主辦)",
        "nameEn": "HO FUNG COLLEGE (SPONSORED BY THE SIK SIK YUEN)"
      },
      {
        "name": "保良局李城璧中學",
        "nameEn": "PO LEUNG KUK LEE SHING PIK COLLEGE"
      },
      {
        "name": "可觀自然教育中心暨天文館",
        "nameEn": "HO KOON NATURE EDUCATION CUM ASTRONOMICAL CENTRE"
      },
      {
        "name": "保良局姚連生中學",
        "nameEn": "PO LEUNG KUK YAO LING SUN COLLEGE"
      },
      {
        "name": "仁濟醫院林百欣中學",
        "nameEn": "YAN CHAI HOSPITAL LIM POR YEN SECONDARY SCHOOL"
      },
      {
        "name": "聖公會李炳中學",
        "nameEn": "SHENG KUNG HUI LI PING SECONDARY SCHOOL"
      },
      {
        "name": "廖寶珊紀念書院",
        "nameEn": "LIU PO SHAN MEMORIAL COLLEGE"
      },
      {
        "name": "寶安商會王少清中學",
        "nameEn": "PO ON COMMERCIAL ASSOCIATION WONG SIU CHING SECONDARY SCHOOL"
      },
      {
        "name": "荃灣聖芳濟中學",
        "nameEn": "ST. FRANCIS XAVIER'S SCHOOL, TSUEN WAN"
      }
    ]
  },
  "大埔區": {
    "資助": [
      {
        "name": "新界婦孺福利會基督教銘恩小學",
        "nameEn": "NEW TERRITORIES WOMEN & JUVENILES WELFARE ASSOCIATION CHRISTIAN REMEMBRANCE OF GRACE PRIMARY SCHOOL"
      },
      {
        "name": "大埔浸信會公立學校",
        "nameEn": "TAI PO BAPTIST PUBLIC SCHOOL"
      },
      {
        "name": "大埔浸信會公立學校",
        "nameEn": "TAI PO BAPTIST PUBLIC SCHOOL"
      },
      {
        "name": "仁濟醫院蔡衍濤小學",
        "nameEn": "YAN CHAI HOSPITAL CHOI HIN TO PRIMARY SCHOOL"
      },
      {
        "name": "五旬節聖潔會永光小學",
        "nameEn": "THE PENTECOSTAL HOLINESS CHURCH WING KWONG JUNIOR SCHOOL"
      },
      {
        "name": "大埔崇德黃建常紀念學校",
        "nameEn": "SUNG TAK WONG KIN SHEUNG MEMORIAL SCHOOL"
      },
      {
        "name": "三水同鄉會禤景榮學校",
        "nameEn": "SAM SHUI NATIVES ASSOCIATION HUEN KING WING SCHOOL"
      },
      {
        "name": "香港教育大學賽馬會小學",
        "nameEn": "THE EDUCATION UNIVERSITY OF HONG KONG JOCKEY CLUB PRIMARY SCHOOL"
      },
      {
        "name": "聖公會阮鄭夢芹銀禧小學",
        "nameEn": "S.K.H. YUEN CHEN MAUN CHEN JUBILEE PRIMARY SCHOOL"
      },
      {
        "name": "大埔舊墟公立學校",
        "nameEn": "TAI PO OLD MARKET PUBLIC SCHOOL"
      },
      {
        "name": "港九街坊婦女會孫方中小學",
        "nameEn": "HONG KONG AND KOWLOON KAIFONG WOMEN'S ASSOCIATION SUN FONG CHUNG PRIMARY SCHOOL"
      },
      {
        "name": "香港道教聯合會雲泉吳禮和紀念學校",
        "nameEn": "HONG KONG TAOIST ASSOCIATION WUN TSUEN NG LAI WO MEMORIAL SCHOOL"
      },
      {
        "name": "林村公立黃福鑾紀念學校",
        "nameEn": "LAM TSUEN PUBLIC WONG FOOK LUEN MEMORIAL SCHOOL"
      },
      {
        "name": "大埔舊墟公立學校(寶湖道)",
        "nameEn": "TAI PO OLD MARKET PUBLIC SCHOOL (PLOVER COVE)"
      },
      {
        "name": "大埔浸信會公立學校",
        "nameEn": "TAI PO BAPTIST PUBLIC SCHOOL"
      },
      {
        "name": "新界婦孺福利會有限公司梁省德學校",
        "nameEn": "NEW TERRITORIES WOMEN & JUVENILES WELFARE ASSOCIATION LTD. LEUNG SING TAK PRIMARY SCHOOL"
      },
      {
        "name": "保良局田家炳千禧小學",
        "nameEn": "PO LEUNG KUK TIN KA PING MILLENNIUM PRIMARY SCHOOL"
      },
      {
        "name": "聖公會阮鄭夢芹小學",
        "nameEn": "S.K.H. YUEN CHEN MAUN CHEN PRIMARY SCHOOL"
      },
      {
        "name": "保良局田家炳小學",
        "nameEn": "PO LEUNG KUK TIN KA PING PRIMARY SCHOOL"
      },
      {
        "name": "大埔循道衛理小學",
        "nameEn": "TAI PO METHODIST SCHOOL"
      },
      {
        "name": "天主教聖母聖心小學",
        "nameEn": "SACRED HEART OF MARY CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "神召會康樂中學",
        "nameEn": "ASSEMBLY OF GOD HEBRON SECONDARY SCHOOL"
      },
      {
        "name": "香港道教聯合會圓玄學院第二中學",
        "nameEn": "HONG KONG TAOIST ASSOCIATION THE YUEN YUEN INSTITUTE NO.2 SECONDARY SCHOOL"
      },
      {
        "name": "恩主教書院",
        "nameEn": "VALTORTA COLLEGE"
      },
      {
        "name": "救恩書院",
        "nameEn": "KAU YAN COLLEGE"
      },
      {
        "name": "靈糧堂劉梅軒中學",
        "nameEn": "LING LIANG CHURCH M H LAU SECONDARY SCHOOL"
      },
      {
        "name": "聖公會莫壽增會督中學",
        "nameEn": "SHENG KUNG HUI BISHOP MOK SAU TSENG SECONDARY SCHOOL"
      },
      {
        "name": "孔教學院大成何郭佩珍中學",
        "nameEn": "CONFUCIAN TAI SHING HO KWOK PUI CHUN COLLEGE"
      },
      {
        "name": "港九街坊婦女會孫方中書院",
        "nameEn": "HONG KONG AND KOWLOON KAIFONG WOMEN'S ASSOCIATION SUN FONG CHUNG COLLEGE"
      },
      {
        "name": "迦密聖道中學",
        "nameEn": "CARMEL HOLY WORD SECONDARY SCHOOL"
      },
      {
        "name": "迦密柏雨中學",
        "nameEn": "CARMEL PAK U SECONDARY SCHOOL"
      },
      {
        "name": "香港紅卍字會大埔卍慈中學",
        "nameEn": "HONG KONG RED SWASTIKA SOCIETY TAI PO SECONDARY SCHOOL"
      },
      {
        "name": "佛教大光慈航中學",
        "nameEn": "BUDDHIST TAI KWONG CHI HONG COLLEGE"
      },
      {
        "name": "中華基督教會馮梁結紀念中學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA FUNG LEUNG KIT MEMORIAL SECONDARY SCHOOL"
      },
      {
        "name": "香港教師會李興貴中學",
        "nameEn": "HONG KONG TEACHERS' ASSOCIATION LEE HENG KWEI SECONDARY SCHOOL"
      },
      {
        "name": "中華聖潔會靈風中學",
        "nameEn": "CHINA HOLINESS CHURCH LIVING SPIRIT COLLEGE"
      },
      {
        "name": "南亞路德會沐恩中學",
        "nameEn": "SALEM-IMMANUEL LUTHERAN COLLEGE"
      },
      {
        "name": "王肇枝中學",
        "nameEn": "WONG SHIU CHI SECONDARY SCHOOL"
      }
    ],
    "直接資助計劃": [
      {
        "name": "羅定邦中學",
        "nameEn": "LAW TING PONG SECONDARY SCHOOL"
      },
      {
        "name": "大埔三育中學",
        "nameEn": "TAI PO SAM YUK SECONDARY SCHOOL"
      }
    ]
  },
  "黃大仙區": {
    "資助": [
      {
        "name": "浸信會孔憲紹天虹小學",
        "nameEn": "BAPTIST HUNG HIN SHIU RAINBOW PRIMARY SCHOOL"
      },
      {
        "name": "中華基督教會基華小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI WA PRIMARY SCHOOL"
      },
      {
        "name": "華德學校",
        "nameEn": "BISHOP WALSH PRIMARY SCHOOL"
      },
      {
        "name": "伊斯蘭鮑伯濤紀念小學",
        "nameEn": "ISLAMIC DHARWOOD PAU MEMORIAL PRIMARY SCHOOL"
      },
      {
        "name": "保良局錦泰小學",
        "nameEn": "PO LEUNG KUK GRANDMONT PRIMARY SCHOOL"
      },
      {
        "name": "嗇色園主辦可立小學",
        "nameEn": "HO LAP PRIMARY SCHOOL (SPONSORED BY SIK SIK YUEN)"
      },
      {
        "name": "聖文德天主教小學",
        "nameEn": "ST. BONAVENTURE CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "天主教伍華小學",
        "nameEn": "NG WAH CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "天主教博智小學",
        "nameEn": "PRICE MEMORIAL CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "聖公會基德小學",
        "nameEn": "S.K.H. KEI TAK PRIMARY SCHOOL"
      },
      {
        "name": "嘉諾撒小學",
        "nameEn": "CANOSSA PRIMARY SCHOOL"
      },
      {
        "name": "聖博德天主教小學(蒲崗村道)",
        "nameEn": "ST PATRICK'S CATHOLIC PRIMARY SCHOOL (PO KONG VILLAGE ROAD)"
      },
      {
        "name": "聖博德學校",
        "nameEn": "ST. PATRICK'S SCHOOL"
      },
      {
        "name": "中華基督教會基慈小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI TSZ PRIMARY SCHOOL"
      },
      {
        "name": "真鐸學校",
        "nameEn": "CHUN TOK SCHOOL"
      },
      {
        "name": "黃大仙天主教小學",
        "nameEn": "WONG TAI SIN CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "嘉諾撒小學(新蒲崗)",
        "nameEn": "CANOSSA PRIMARY SCHOOL (SAN PO KONG)"
      },
      {
        "name": "彩雲聖若瑟小學",
        "nameEn": "CHOI WAN ST JOSEPH'S PRIMARY SCHOOL"
      },
      {
        "name": "保良局陳南昌夫人小學",
        "nameEn": "PO LEUNG KUK MRS. CHAN NAM CHONG MEMORIAL PRIMARY SCHOOL"
      },
      {
        "name": "福德學校",
        "nameEn": "BISHOP FORD MEMORIAL SCHOOL"
      },
      {
        "name": "孔教學院大成小學",
        "nameEn": "CONFUCIAN TAI SHING PRIMARY SCHOOL"
      },
      {
        "name": "獻主會溥仁小學",
        "nameEn": "PO YAN OBLATE PRIMARY SCHOOL"
      },
      {
        "name": "慈雲山聖文德天主教小學",
        "nameEn": "TSZ WAN SHAN ST BONAVENTURE CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "慈雲山天主教小學",
        "nameEn": "TSZ WAN SHAN CATHOLIC PRIMARY SCHOOL"
      },
      {
        "name": "保良局第一張永慶中學",
        "nameEn": "PO LEUNG KUK NO.1 W.H. CHEUNG COLLEGE"
      },
      {
        "name": "天主教伍華中學",
        "nameEn": "NG WAH CATHOLIC SECONDARY SCHOOL"
      },
      {
        "name": "佛教孔仙洲紀念中學",
        "nameEn": "BUDDHIST HUNG SEAN CHAU MEMORIAL COLLEGE"
      },
      {
        "name": "聖公會聖本德中學",
        "nameEn": "SHENG KUNG HUI ST. BENEDICT'S SCHOOL"
      },
      {
        "name": "可立中學(嗇色園主辦)",
        "nameEn": "HO LAP COLLEGE (SPONSORED BY THE SIK SIK YUEN)"
      },
      {
        "name": "中華基督教會扶輪中學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA ROTARY SECONDARY SCHOOL"
      },
      {
        "name": "潔心林炳炎中學",
        "nameEn": "KIT SAM LAM BING YIM SECONDARY SCHOOL"
      },
      {
        "name": "中華基督教會基協中學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI HEEP SECONDARY SCHOOL"
      },
      {
        "name": "佛教志蓮中學",
        "nameEn": "CHI LIN BUDDHIST SECONDARY SCHOOL"
      },
      {
        "name": "聖母書院",
        "nameEn": "OUR LADY'S COLLEGE"
      },
      {
        "name": "彩虹邨天主教英文中學",
        "nameEn": "CHOI HUNG ESTATE CATHOLIC SECONDARY SCHOOL"
      },
      {
        "name": "救世軍卜維廉中學",
        "nameEn": "THE SALVATION ARMY WILLIAM BOOTH SECONDARY SCHOOL"
      },
      {
        "name": "中華基督教會協和書院",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA HEEP WOH COLLEGE"
      },
      {
        "name": "聖文德書院",
        "nameEn": "ST. BONAVENTURE COLLEGE AND HIGH SCHOOL"
      },
      {
        "name": "香港神託會培敦中學",
        "nameEn": "STEWARDS POOI TUN SECONDARY SCHOOL"
      },
      {
        "name": "五旬節聖潔會永光書院",
        "nameEn": "THE PENTECOSTAL HOLINESS CHURCH WING KWONG COLLEGE"
      },
      {
        "name": "李求恩紀念中學",
        "nameEn": "LEE KAU YAN MEMORIAL SCHOOL"
      },
      {
        "name": "保良局何蔭棠中學",
        "nameEn": "PO LEUNG KUK CELINE HO YAM TONG COLLEGE"
      },
      {
        "name": "樂善堂王仲銘中學",
        "nameEn": "LOK SIN TONG WONG CHUNG MING SECONDARY SCHOOL"
      },
      {
        "name": "樂善堂余近卿中學",
        "nameEn": "LOK SIN TONG YU KAN HING SECONDARY SCHOOL"
      },
      {
        "name": "德愛中學",
        "nameEn": "TAK OI SECONDARY SCHOOL"
      }
    ],
    "直接資助計劃": [
      {
        "name": "德望學校",
        "nameEn": "GOOD HOPE SCHOOL"
      }
    ]
  },
  "離島區": {
    "資助": [
      {
        "name": "東涌天主教學校",
        "nameEn": "TUNG CHUNG CATHOLIC SCHOOL"
      },
      {
        "name": "中華基督教會長洲堂錦江小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA CHEUNG CHAU CHURCH KAM KONG PRIMARY SCHOOL"
      },
      {
        "name": "青松侯寶垣小學",
        "nameEn": "CHING CHUNG HAU PO WOON PRIMARY SCHOOL"
      },
      {
        "name": "長洲聖心學校",
        "nameEn": "CHEUNG CHAU SACRED HEART SCHOOL"
      },
      {
        "name": "寶安商會溫浩根小學",
        "nameEn": "PO ON COMMERCIAL ASSOCIATION WAN HO KAN PRIMARY SCHOOL"
      },
      {
        "name": "靈糧堂秀德小學",
        "nameEn": "LING LIANG CHURCH SAU TAK PRIMARY SCHOOL"
      },
      {
        "name": "香港教育工作者聯會黃楚標學校",
        "nameEn": "HKFEW WONG CHO BAU SCHOOL"
      },
      {
        "name": "國民學校",
        "nameEn": "KWOK MAN SCHOOL"
      },
      {
        "name": "南丫北段公立小學",
        "nameEn": "NORTHERN LAMMA SCHOOL"
      },
      {
        "name": "梅窩學校",
        "nameEn": "MUI WO SCHOOL"
      },
      {
        "name": "救世軍林拔中紀念學校",
        "nameEn": "THE SALVATION ARMY LAM BUTT CHUNG MEMORIAL SCHOOL"
      },
      {
        "name": "嗇色園主辦可譽中學暨可譽小學",
        "nameEn": "HO YU COLLEGE AND PRIMARY SCHOOL (SPONSORED BY SIK SIK YUEN)"
      },
      {
        "name": "中華基督教會大澳小學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA TAI O PRIMARY SCHOOL"
      },
      {
        "name": "聖公會偉倫小學",
        "nameEn": "S.K.H. WEI LUN PRIMARY SCHOOL"
      },
      {
        "name": "杯澳公立學校",
        "nameEn": "BUI O PUBLIC SCHOOL"
      },
      {
        "name": "聖家學校",
        "nameEn": "HOLY FAMILY SCHOOL"
      },
      {
        "name": "明愛胡振中書院",
        "nameEn": "CARITAS WU CHENG-CHUNG COLLEGE"
      },
      {
        "name": "東涌天主教學校",
        "nameEn": "TUNG CHUNG CATHOLIC SCHOOL"
      },
      {
        "name": "明愛陳震夏郊野學園",
        "nameEn": "CARITAS CHAN CHUN HA FIELD STUDIES CENTRE"
      },
      {
        "name": "香港教育工作者聯會黃楚標中學",
        "nameEn": "HKFEW WONG CHO BAU SECONDARY SCHOOL"
      },
      {
        "name": "保良局馬錦明夫人章馥仙中學",
        "nameEn": "PO LEUNG KUK MRS MA KAM MING-CHEUNG FOOK SIEN COLLEGE"
      },
      {
        "name": "嗇色園主辦可譽中學暨可譽小學",
        "nameEn": "HO YU COLLEGE AND PRIMARY SCHOOL (SPONSORED BY SIK SIK YUEN)"
      },
      {
        "name": "明愛陳震夏郊野學園",
        "nameEn": "CARITAS CHAN CHUN HA FIELD STUDIES CENTRE"
      },
      {
        "name": "靈糧堂怡文中學",
        "nameEn": "LING LIANG CHURCH E WUN SECONDARY SCHOOL"
      }
    ],
    "直接資助計劃": [
      {
        "name": "佛教筏可紀念中學",
        "nameEn": "BUDDHIST FAT HO MEMORIAL COLLEGE"
      },
      {
        "name": "港青基信書院",
        "nameEn": "YMCA OF HONG KONG CHRISTIAN COLLEGE"
      }
    ]
  },
  "北區": {
    "資助": [
      {
        "name": "東莞學校",
        "nameEn": "TUNG KOON SCHOOL"
      },
      {
        "name": "粉嶺公立學校",
        "nameEn": "FANLING PUBLIC SCHOOL"
      },
      {
        "name": "五旬節于良發小學",
        "nameEn": "PENTECOSTAL YU LEUNG FAT PRIMARY SCHOOL"
      },
      {
        "name": "東華三院馬錦燦紀念小學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS MA KAM CHAN MEMORIAL PRIMARY SCHOOL"
      },
      {
        "name": "鳳溪第一小學",
        "nameEn": "FUNG KAI NO.1 PRIMARY SCHOOL"
      },
      {
        "name": "聖公會榮真小學",
        "nameEn": "S.K.H. WING CHUN PRIMARY SCHOOL"
      },
      {
        "name": "李志達紀念學校",
        "nameEn": "LEE CHI TAT MEMORIAL SCHOOL"
      },
      {
        "name": "鳳溪廖潤琛紀念學校",
        "nameEn": "FUNG KAI LIU YUN-SUM MEMORIAL SCHOOL"
      },
      {
        "name": "福德學社小學",
        "nameEn": "FUK TAK EDUCATION SOCIETY PRIMARY SCHOOL"
      },
      {
        "name": "育賢學校",
        "nameEn": "YUK YIN SCHOOL"
      },
      {
        "name": "金錢村何東學校",
        "nameEn": "KAM TSIN VILLAGE HO TUNG SCHOOL"
      },
      {
        "name": "五旬節靳茂生小學",
        "nameEn": "PENTECOSTAL GIN MAO SHENG PRIMARY SCHOOL"
      },
      {
        "name": "基督教粉嶺神召會小學",
        "nameEn": "FANLING ASSEMBLY OF GOD CHURCH PRIMARY SCHOOL"
      },
      {
        "name": "鳳溪創新小學",
        "nameEn": "FUNG KAI INNOVATIVE SCHOOL"
      },
      {
        "name": "曾梅千禧學校",
        "nameEn": "TSANG MUI MILLENNIUM SCHOOL"
      },
      {
        "name": "香海正覺蓮社佛教正慧小學",
        "nameEn": "HHCKLA BUDDHIST WISDOM PRIMARY SCHOOL"
      },
      {
        "name": "福德學社小學",
        "nameEn": "FUK TAK EDUCATION SOCIETY PRIMARY SCHOOL"
      },
      {
        "name": "上水宣道小學",
        "nameEn": "ALLIANCE PRIMARY SCHOOL, SHEUNG SHUI"
      },
      {
        "name": "上水惠州公立學校",
        "nameEn": "WAI CHOW PUBLIC SCHOOL (SHEUNG SHUI)"
      },
      {
        "name": "香海正覺蓮社佛教陳式宏學校",
        "nameEn": "HHCKLA BUDDHIST CHAN SHI WAN PRIMARY SCHOOL"
      },
      {
        "name": "方樹福堂基金方樹泉小學",
        "nameEn": "FONG SHU FOOK TONG FOUNDATION FONG SHU CHUEN PRIMARY SCHOOL"
      },
      {
        "name": "寶血會培靈學校",
        "nameEn": "PUI LING SCHOOL OF THE PRECIOUS BLOOD"
      },
      {
        "name": "東華三院港九電器商聯會小學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS HONG KONG & KOWLOON ELECTRICAL APPLIANCES MERCHANTS ASSOCIATION LTD. SCHOOL"
      },
      {
        "name": "打鼓嶺嶺英公立學校",
        "nameEn": "TA KU LING LING YING PUBLIC SCHOOL"
      },
      {
        "name": "石湖墟公立學校",
        "nameEn": "SHEK WU HUI PUBLIC SCHOOL"
      },
      {
        "name": "香海正覺蓮社佛教正覺蓮社學校",
        "nameEn": "HHCKLA BUDDHIST CHING KOK LIN ASSOCIATION SCHOOL"
      },
      {
        "name": "聖公會嘉福榮真小學",
        "nameEn": "S.K.H. KA FUK WING CHUN PRIMARY SCHOOL"
      },
      {
        "name": "沙頭角中心小學",
        "nameEn": "SHA TAU KOK CENTRAL PRIMARY SCHOOL"
      },
      {
        "name": "救世軍中原慈善基金皇后山學校",
        "nameEn": "THE SALVATION ARMY CENTALINE CHARITY FUND QUEEN'S HILL SCHOOL"
      },
      {
        "name": "東華三院曾憲備小學",
        "nameEn": "TWGHS TSENG HIN PEI PRIMARY SCHOOL"
      },
      {
        "name": "明愛粉嶺陳震夏中學",
        "nameEn": "CARITAS FANLING CHAN CHUN HA SECONDARY SCHOOL"
      },
      {
        "name": "宣道會陳朱素華紀念中學",
        "nameEn": "CHRISTIAN ALLIANCE S W CHAN MEMORIAL COLLEGE"
      },
      {
        "name": "鳳溪第一中學",
        "nameEn": "FUNG KAI NO.1 SECONDARY SCHOOL"
      },
      {
        "name": "香港道教聯合會鄧顯紀念中學",
        "nameEn": "HONG KONG TAOIST ASSOCIATION TANG HIN MEMORIAL SECONDARY SCHOOL"
      },
      {
        "name": "東華三院甲寅年總理中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS KAP YAN DIRECTORS' COLLEGE"
      },
      {
        "name": "東華三院李嘉誠中學",
        "nameEn": "TUNG WAH GROUP OF HOSPITALS LI KA SHING COLLEGE"
      },
      {
        "name": "中華基督教會基新中學",
        "nameEn": "THE CHURCH OF CHRIST IN CHINA KEI SAN SECONDARY SCHOOL"
      },
      {
        "name": "保良局馬錦明中學",
        "nameEn": "PO LEUNG KUK MA KAM MING COLLEGE"
      },
      {
        "name": "新界喇沙中學",
        "nameEn": "DE LA SALLE SECONDARY SCHOOL N T"
      },
      {
        "name": "風采中學(教育評議會主辦)",
        "nameEn": "ELEGANTIA COLLEGE (SPONSORED BY EDUCATION CONVERGENCE)"
      },
      {
        "name": "田家炳中學",
        "nameEn": "TIN KA PING SECONDARY SCHOOL"
      },
      {
        "name": "聖公會陳融中學",
        "nameEn": "S.K.H. CHAN YOUNG SECONDARY SCHOOL"
      },
      {
        "name": "聖芳濟各書院",
        "nameEn": "ST. FRANCIS OF ASSISI'S COLLEGE"
      },
      {
        "name": "粉嶺禮賢會中學",
        "nameEn": "FANLING RHENISH CHURCH SECONDARY SCHOOL"
      },
      {
        "name": "鳳溪廖萬石堂中學",
        "nameEn": "FUNG KAI LIU MAN SHEK TONG SECONDARY SCHOOL"
      },
      {
        "name": "粉嶺救恩書院",
        "nameEn": "FANLING KAU YAN COLLEGE"
      },
      {
        "name": "香海正覺蓮社佛教馬錦燦紀念英文中學",
        "nameEn": "HHCKLA BUDDHIST MA KAM CHAN MEMORIAL ENGLISH SECONDARY SCHOOL"
      }
    ],
    "直接資助計劃": [
      {
        "name": "基督教香港信義會心誠中學",
        "nameEn": "FANLING LUTHERAN SECONDARY SCHOOL"
      }
    ]
  }
};

export const NON_HK_SCHOOL_OPTION = 'non-hk';
