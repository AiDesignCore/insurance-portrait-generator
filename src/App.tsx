/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  UserRound, 
  Sparkles, 
  Camera, 
  RefreshCw, 
  Download,
  Settings2,
  Info,
  Users,
  Plus,
  Minus,
  Trash2,
  Upload,
  X,
  Type
} from 'lucide-react';
import { generatePortrait, analyzeImage, SceneOptions, PersonConfig } from './services/geminiService';

const ETHNICITIES = ['Taiwanese (台灣人)', 'East Asian', 'Caucasian', 'African', 'Hispanic', 'South Asian', 'Middle Eastern'];
const SCENES = ['Natural Park (自然公園)', 'Qingtiangang Grassland (擎天崗草原)', 'Park (公園)', 'Amusement Park (遊樂場)', 'Room (房間)', 'Rehabilitation Center (復健中心)', 'City Street (城市街道)', 'Cafe (咖啡廳)', 'Seaside (海邊)', 'Beach (沙灘)', 'Company (公司)', 'Living Room (客廳)', 'Hospital (醫院)', 'Mountain Climbing (登山)', 'Yacht (遊艇), Swimming Pool (泳池)', 'Riverside (溪邊)', 'Hill (小山)', 'Trail (步道)', 'Blue Screen (藍幕 - 方便去背)', 'Custom (自定義)'];
const ACTIONS = [
  'Flying a kite (放風箏)',
  'Holding a balloon (拿氣球)',
  'Throwing a ball (投球)',
  'Gymnastics (體操)',
  'Eating ice cream (吃冰淇淋)',
  'Eating (吃飯)',
  'Watching a tablet (看平板)',
  'Muscle training (肌肉訓練)',
  'Squats (深蹲)',
  'Walking (健走)',
  'Walking (走路)',
  'Running (跑步)',
  'Jogging (慢跑)',
  'Hiking (健行)',
  'Swimming (游泳)',
  'Fishing (釣魚)',
  'Cycling (騎腳踏車)',
  'Yoga (瑜伽)',
  'Dancing (跳舞)',
  'Picnic (野餐)',
  'Chatting (聊天)',
  'Drinking coffee (喝咖啡)',
  'Reading (閱讀)',
  'Cooking (烹飪)',
  'Gardening (園藝)',
  'Playing Guitar (彈吉他)',
  'Playing Piano (彈鋼琴)',
  'Painting (繪畫)',
  'Writing (寫作)',
  'Meditating (冥想)',
  'Playing with Pets (與寵物玩耍)',
  'Taking Photos (攝影)',
  'Shopping (購物)',
  'Surfing (衝浪)',
  'Skiing (滑雪)',
  'Skating (溜冰)',
  'Camping (露營)',
  'Working (工作)',
  'Resting (休息)',
  'Sleeping (睡覺)',
  'Diving (潛水)',
  'Snorkeling (浮潛)',
  'Sitting (坐著)',
  'Standing (站著)',
  'Stretching (伸懶腰)',
  'Singing (唱歌)',
  'Deep breathing (深呼吸)',
  'Laughing (大笑)',
  'Speaking (說話)',
  'Teaching (教學/上課)',
  'Hugging (擁抱)',
  'Sick (生病/不舒服)',
  'Sad (難過)',
  'Custom (自定義)'
];
const IDENTITIES = ['Grandpa (爺爺)', 'Grandma (奶奶)', 'Dad (爸爸)', 'Mom (媽媽)', 'Son (兒子)', 'Daughter (女兒)', 'Professional Doctor (專業醫生)', 'Nurse (護士)', 'Patient (病人)', 'Insurance Agent (保險員)', 'AI機器人 (AI Robot)', '可愛機器人 (Cute Robot)'];
const ASSISTIVE_DEVICES = [
  '無 (None)',
  '坐輪椅 (Wheelchair)',
  '拿拐杖 (Crutches)',
  '拿登山杖 (Trekking poles)',
  '手堆車 (Handcart)',
  '嬰兒車 (Stroller)',
  'Custom (自定義)'
];
const HAIR_COLORS = ['Black (黑)', 'White (白)', 'Grey (灰)', 'Partially Grey (部分白髮)', 'Brown', 'Blonde'];
const HAIR_STYLES = ['Long Hair (長髮)', 'Short Hair (短髮)', 'Short Curly (短捲髮)', 'Long Curly (長捲髮)', 'Bald (光頭)', 'Balding (禿頭)', 'Medium Length (中長髮)', 'Punk (龐克)', 'Big Wave (大波浪)', 'Custom (自定義)'];
const BODY_BUILDS = ['Slim', 'Athletic', 'Average', 'Muscular', 'Curvy', 'Stocky'];
const LIGHTING_STYLES = ['Soft Studio', 'Natural Sunlight', 'Golden Hour', 'Moody Low-key', 'Bright Interior'];
const WEATHER = ['Sunny (晴天)', 'Cloudy (多雲)', 'Rainy (下雨)', 'Snowy (下雪)', 'Foggy (大霧)', 'Stormy (暴風雨)'];
const CLOTHING_STYLES = [
  'Casual Wear (休閒服)',
  'Doctor (醫生)',
  'Nurse (護士)',
  'Patient (病人)',
  'Home Wear (家居服)',
  'Suit (西裝)',
  'Formal Dress (禮服)',
  'Student Uniform (學生制服)',
  'Dress (洋裝)',
  'Sportswear (運動服)',
  'Professional Attire (職業裝)',
  'Swimwear (泳裝)',
  'Wetsuit (潛水服)',
  'Life Vest (救生背心)',
  'Custom (自定義)'
];
const STYLES = [
  'Photorealistic (照片寫實)',
  'Cinematic (電影感)',
  '3D PAPER CRAFT (紙模型)',
  'Paper Cut (紙雕風)',
  'Clay Style (紙黏土風)',
  'Origami (摺紙風)',
  'Felt Craft (羊毛氈)',
  'Wood Carving (木雕)',
  'Toy style (玩具風)',
  'Clay Toy (黏土玩具風)',
  'Inflatable (泡泡膠風)',
  'Jelly (果凍風)',
  'Chrome (金屬鉻風)',
  'Glass (玻璃風)',
  'Steampunk (蒸氣龐克)',
  'Low Poly (低多邊形)',
  'Isometric (等角視角)',
  'Claymation',
  'Illustration (數位插畫)',
  'Anime / Manga (動漫)',
  'Oil Painting (油畫風)',
  'Abstract (抽象藝術)',
  'Flat Design (扁平設計)',
  '3D Render (3D渲染)',
  'Cyberpunk (賽博龐克)',
  'Surrealism (超現實)',
  'Cartoon (卡通風)',
  '仿真機器人 (Realistic Robot)',
  '可愛卡通機器人 (Cute Cartoon Robot)',
  'Custom (自定義)',
  // ── 新增風格 ──
  'Watercolor (水彩畫)',
  'Ink Wash (水墨畫)',
  'Pencil Sketch (鉛筆素描)',
  'Sticker (貼紙風)',
  'Comic Book (美式漫畫)',
  'Retro Vintage (復古懷舊)',
  'Neon Glow (霓虹發光)',
  'Pixel Art (像素藝術)',
  'Voxel Art (體素藝術)',
  'Pastel (粉彩風)',
  'Minimalist (極簡風)',
  'Pop Art (普普藝術)',
  'Ukiyo-e (浮世繪)',
  'Art Nouveau (新藝術)',
  'Baroque (巴洛克)',
  'Impressionist (印象派)',
  'Graffiti (塗鴉街頭)',
  'Line Art (線條藝術)',
  'Neon Punk (霓虹龐克)',
  'Fantasy (奇幻插畫)',
  'Sci-Fi (科幻)',
  'Horror (恐怖風)',
  'Children Book (兒童繪本)',
  'Flat Icon (扁平圖示)',
  'Golden Hour Photo (黃金時刻攝影)',
  'Macro Photo (微距攝影)',
  'Film Noir (黑色電影)',
  'Double Exposure (多重曝光)',
  'Tilt Shift (移軸攝影)',
  'HDR Photo (HDR 攝影)',
];

const CAMERA_ANGLES = [
  'Wide Shot (廣角)',
  'Medium Shot (中景)',
  'Close-up (特寫)',
  'Extreme Close-up (極特寫)',
  'Zoomed In (放大)',
  'Zoomed Out (縮小)',
  'Low Angle (低角度)',
  'High Angle (高角度)',
  'Bird\'s Eye View (俯瞰)',
  'Custom (自定義)'
];

const FACING_ANGLES = ['正面 (Front)', '背面 (Back)', '右側 (Right Side)', '左側 (Left Side)'];

const ASPECT_RATIOS = [
  { value: '1:1',  label: 'Square',        icon: '⬜' },
  { value: '16:9', label: 'Widescreen',    icon: '▬' },
  { value: '9:16', label: 'Social Story',  icon: '▮' },
  { value: '2:3',  label: 'Portrait',      icon: '▯' },
  { value: '3:4',  label: 'Traditional',   icon: '▭' },
  { value: '1:2',  label: 'Vertical',      icon: '▮' },
  { value: '2:1',  label: 'Horizontal',    icon: '▬' },
  { value: '4:5',  label: 'Social Post',   icon: '▭' },
  { value: '3:2',  label: 'Standard',      icon: '▬' },
  { value: '4:3',  label: 'Classic',       icon: '▭' },
];

const INSURANCE_THEMES = [
  {
    id: 'young',
    label: '小資族',
    icon: UserRound,
    description: 'Young professional in a modern office, looking confident.',
    options: {
      numPeople: 1,
      scene: 'Company (公司)',
      lighting: 'Bright Interior',
      style: 'Photorealistic (照片寫實)',
      mainTitle: '小資理財 第一步',
      showMainTitle: true,
      mainTitlePos: { x: 50, y: 20 },
      people: [{
        identity: 'Insurance Agent (保險員)',
        gender: 'Female',
        age: '28',
        hairStyle: 'Medium Length (中長髮)',
        hairColor: 'Black (黑)',
        bodyBuild: 'Slim',
        clothing: 'Professional Attire (職業裝)',
        action: 'Working (工作)',
        facingAngle: '正面 (Front)',
        assistiveDevice: '無 (None)'
      }]
    }
  },
  {
    id: 'senior',
    label: '長者',
    icon: Users,
    description: 'Elderly couple enjoying retirement in a park.',
    options: {
      numPeople: 2,
      scene: 'Park (公園)',
      lighting: 'Natural Sunlight',
      style: 'Photorealistic (照片寫實)',
      mainTitle: '樂活退休 享晚年',
      showMainTitle: true,
      mainTitlePos: { x: 50, y: 20 },
      people: [
        {
          identity: 'Grandpa (爺爺)',
          gender: 'Male',
          age: '70',
          hairStyle: 'Short Hair (短髮)',
          hairColor: 'White (白)',
          bodyBuild: 'Average',
          clothing: 'Casual Wear (休閒服)',
          action: 'Walking (走路)',
          facingAngle: '正面 (Front)',
          assistiveDevice: '無 (None)'
        },
        {
          identity: 'Grandma (奶奶)',
          gender: 'Female',
          age: '68',
          hairStyle: 'Short Curly (短捲髮)',
          hairColor: 'White (白)',
          bodyBuild: 'Average',
          clothing: 'Casual Wear (休閒服)',
          action: 'Walking (走路)',
          facingAngle: '正面 (Front)',
          assistiveDevice: '無 (None)'
        }
      ]
    }
  },
  {
    id: 'family',
    label: '家庭',
    icon: Users,
    description: 'Happy family in a warm living room.',
    options: {
      numPeople: 3,
      scene: 'Living Room (客廳)',
      lighting: 'Bright Interior',
      style: 'Photorealistic (照片寫實)',
      mainTitle: '守護家人 守護愛',
      showMainTitle: true,
      mainTitlePos: { x: 50, y: 20 },
      people: [
        {
          identity: 'Dad (爸爸)',
          gender: 'Male',
          age: '35',
          hairStyle: 'Short Hair (短髮)',
          hairColor: 'Black (黑)',
          bodyBuild: 'Athletic',
          clothing: 'Casual Wear (休閒服)',
          action: 'Chatting (聊天)',
          facingAngle: '正面 (Front)',
          assistiveDevice: '無 (None)'
        },
        {
          identity: 'Mom (媽媽)',
          gender: 'Female',
          age: '32',
          hairStyle: 'Long Hair (長髮)',
          hairColor: 'Black (黑)',
          bodyBuild: 'Slim',
          clothing: 'Casual Wear (休閒服)',
          action: 'Chatting (聊天)',
          facingAngle: '正面 (Front)',
          assistiveDevice: '無 (None)'
        },
        {
          identity: 'Son (兒子)',
          gender: 'Male',
          age: '5',
          hairStyle: 'Short Hair (短髮)',
          hairColor: 'Black (黑)',
          bodyBuild: 'Slim',
          clothing: 'Casual Wear (休閒服)',
          action: 'Eating ice cream (吃冰淇淋)',
          facingAngle: '正面 (Front)',
          assistiveDevice: '無 (None)'
        }
      ]
    }
  },
  {
    id: 'child',
    label: '兒童',
    icon: Sparkles,
    description: 'Children playing safely in an amusement park.',
    options: {
      numPeople: 1,
      scene: 'Amusement Park (遊樂場)',
      lighting: 'Natural Sunlight',
      style: 'Photorealistic (照片寫實)',
      mainTitle: '寶貝成長 零負擔',
      showMainTitle: true,
      mainTitlePos: { x: 50, y: 20 },
      people: [{
        identity: 'Daughter (女兒)',
        gender: 'Female',
        age: '8',
        hairStyle: 'Long Hair (長髮)',
        hairColor: 'Black (黑)',
        bodyBuild: 'Slim',
        clothing: 'Student Uniform (學生制服)',
        action: 'Holding a balloon (拿氣球)',
        facingAngle: '正面 (Front)',
        assistiveDevice: '無 (None)'
      }]
    }
  },
  {
    id: 'medical',
    label: '醫療',
    icon: Plus,
    description: 'Professional medical staff in a hospital.',
    options: {
      numPeople: 1,
      scene: 'Hospital (醫院)',
      lighting: 'Bright Interior',
      style: 'Photorealistic (照片寫實)',
      mainTitle: '醫療保障 最安心',
      showMainTitle: true,
      mainTitlePos: { x: 50, y: 20 },
      people: [{
        identity: 'Professional Doctor (專業醫生)',
        gender: 'Male',
        age: '45',
        hairStyle: 'Short Hair (短髮)',
        hairColor: 'Black (黑)',
        bodyBuild: 'Average',
        clothing: 'Doctor (醫生)',
        action: 'Working (工作)',
        facingAngle: '正面 (Front)',
        assistiveDevice: '無 (None)'
      }]
    }
  },
  {
    id: 'cancer',
    label: '癌症',
    icon: Info,
    description: 'Supportive environment for recovery.',
    options: {
      numPeople: 2,
      scene: 'Rehabilitation Center (復健中心)',
      lighting: 'Bright Interior',
      style: 'Photorealistic (照片寫實)',
      mainTitle: '抗癌路上 不孤單',
      showMainTitle: true,
      mainTitlePos: { x: 50, y: 20 },
      people: [
        {
          identity: 'Patient (病人)',
          gender: 'Female',
          age: '50',
          hairStyle: 'Short Hair (短髮)',
          hairColor: 'Black (黑)',
          bodyBuild: 'Slim',
          clothing: 'Patient (病人)',
          action: 'Resting (休息)',
          facingAngle: '正面 (Front)',
          assistiveDevice: '坐輪椅 (Wheelchair)'
        },
        {
          identity: 'Nurse (護士)',
          gender: 'Female',
          age: '30',
          hairStyle: 'Medium Length (中長髮)',
          hairColor: 'Black (黑)',
          bodyBuild: 'Slim',
          clothing: 'Nurse (護士)',
          action: 'Working (工作)',
          facingAngle: '正面 (Front)',
          assistiveDevice: '無 (None)'
        }
      ]
    }
  },
  {
    id: 'cartoon_kids',
    label: '卡通少兒',
    icon: Sparkles,
    description: 'Cute cartoon characters for children insurance.',
    options: {
      numPeople: 1,
      scene: 'Amusement Park (遊樂場)',
      lighting: 'Bright Interior',
      style: 'Cartoon (卡通風)',
      mainTitle: '給孩子最萌的守護',
      showMainTitle: true,
      mainTitlePos: { x: 50, y: 20 },
      people: [{
        identity: 'Cute Character (萌萌噠腳色)',
        gender: 'Male',
        age: 8,
        hairStyle: 'Short Hair (短髮)',
        hairColor: 'Brown (棕)',
        bodyBuild: 'Slim',
        clothing: 'Casual Wear (休閒服)',
        action: 'Playing (玩耍)',
        facingAngle: '正面 (Front)',
        assistiveDevice: '無 (None)'
      }]
    }
  },
  {
    id: 'ai_robot',
    label: 'AI智慧客服',
    icon: Sparkles,
    description: 'Cute, chubby AI robot helping a customer, cartoon style.',
    options: {
      numPeople: 2,
      scene: 'Company (公司)',
      lighting: 'Bright Interior',
      style: '可愛卡通機器人 (Cute Cartoon Robot)',
      mainTitle: 'AI智慧服務 隨時都在',
      showMainTitle: true,
      mainTitlePos: { x: 50, y: 20 },
      people: [
        {
          identity: '可愛機器人 (Cute Robot)',
          gender: 'Male',
          age: 3,
          hairStyle: 'Bald (光頭)',
          hairColor: 'White (白)',
          bodyBuild: 'Stocky',
          clothing: 'Formal Dress (禮服)',
          action: 'Standing (站著)',
          facingAngle: '正面 (Front)',
          assistiveDevice: '無 (None)',
          customPrompt: 'chubby, friendly robot with expressive eyes'
        },
        {
          identity: 'Professional Actor (專業演員)',
          gender: 'Female',
          age: 30,
          hairStyle: 'Medium Length (中長髮)',
          hairColor: 'Black (黑)',
          bodyBuild: 'Average',
          clothing: 'Professional Attire (職業裝)',
          action: 'Chatting (聊天)',
          facingAngle: '正面 (Front)',
          assistiveDevice: '無 (None)'
        }
      ]
    }
  }
];

const TIME_OF_DAY = [
  'Early Morning (清晨)',
  'Noon (中午)',
  'Daytime (白天)',
  'Evening (晚上)',
  'Late Night (深夜)'
];

const createDefaultPerson = (): PersonConfig => ({
  identity: IDENTITIES[0],
  gender: 'female',
  age: '25',
  action: ACTIONS[0],
  facingAngle: FACING_ANGLES[0],
  clothing: CLOTHING_STYLES[0],
  bodyBuild: 'Average',
  hairStyle: HAIR_STYLES[0],
  hairColor: 'Black (黑)',
  assistiveDevice: ASSISTIVE_DEVICES[0],
  customPrompt: ''
});

export default function App() {
  const [sceneOptions, setSceneOptions] = useState<SceneOptions>({
    numPeople: 1,
    people: [createDefaultPerson()],
    ethnicity: 'Taiwanese (台灣人)',
    scene: SCENES[0],
    lighting: 'Natural Sunlight',
    style: STYLES[0],
    cameraAngle: CAMERA_ANGLES[1], // Default to Medium Shot
    timeOfDay: TIME_OF_DAY[2], // Default to Daytime
    weather: WEATHER[0], // Default to Sunny
    showMainTitle: false,
    mainTitle: '',
    mainTitlePos: { x: 50, y: 20 },
    showSubtitle: false,
    subtitle: '',
    subtitlePos: { x: 50, y: 35 },
    showBodyText: false,
    bodyText: '',
    bodyTextPos: { x: 50, y: 80 },
    aspectRatio: '16:9'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePersonIndex, setActivePersonIndex] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraAngleInputRef = React.useRef<HTMLInputElement>(null);
  const referenceInputRef = React.useRef<HTMLInputElement>(null);
  const previewContainerRef = React.useRef<HTMLDivElement>(null);

  const handleReferenceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setIsAnalyzing(true);
        setError(null);
        try {
          const suggestedOptions = await analyzeImage(base64);
          if (suggestedOptions) {
            setSceneOptions(prev => ({
              ...prev,
              ...suggestedOptions,
              styleImage: base64,
              cameraAngleImage: base64,
              style: suggestedOptions.style || 'Custom (自定義)',
              cameraAngle: suggestedOptions.cameraAngle || 'Custom (自定義)',
              people: (suggestedOptions.people as any[])?.slice(0, 6).map(p => ({
                ...createDefaultPerson(),
                ...p
              })) || prev.people
            }));
            setActivePersonIndex(0);
          }
        } catch (err) {
          console.error("Analysis failed", err);
          setError("Failed to analyze image. Setting it as reference only.");
          // Still set it as reference images even if AI analysis fails
          updateSceneOption('styleImage', base64);
          updateSceneOption('cameraAngleImage', base64);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSceneOption('styleImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraAngleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSceneOption('cameraAngleImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const imageUrl = await generatePortrait(sceneOptions);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError('Failed to generate scene. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickTheme = async (theme: typeof INSURANCE_THEMES[0]) => {
    const newOptions = {
      ...sceneOptions,
      ...theme.options,
      people: theme.options.people.map(p => ({
        ...createDefaultPerson(),
        ...p
      }))
    };
    setSceneOptions(newOptions);
    setActivePersonIndex(0);
    
    // Auto generate
    setIsGenerating(true);
    setError(null);
    try {
      const imageUrl = await generatePortrait(newOptions);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError('Failed to generate scene. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      // Data URLs don't need crossOrigin, but for safety with external URLs:
      if (!generatedImage.startsWith('data:')) {
        img.crossOrigin = "anonymous";
      }
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = generatedImage;
      });

      // Ensure image is fully decoded
      if ('decode' in img) {
        await img.decode();
      }

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw base image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Helper to draw text overlay
      const drawOverlay = (text: string, pos: { x: number, y: number }, fontSize: number, isBold: boolean, color: string, opacity: number, borderColor: string) => {
        if (!text) return;

        ctx.save();
        
        // Scale font size based on canvas width (assuming base width of 1280 for the font sizes)
        const scale = canvas.width / 1280;
        const scaledFontSize = fontSize * scale;

        ctx.font = `${isBold ? 'bold ' : ''}${scaledFontSize}px system-ui, -apple-system, sans-serif`;
        
        const paddingX = scaledFontSize * 0.6;
        const paddingY = scaledFontSize * 0.3;
        
        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = scaledFontSize;

        const x = (pos.x / 100) * canvas.width;
        const y = (pos.y / 100) * canvas.height;

        // Draw background box
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        const boxWidth = textWidth + paddingX * 2;
        const boxHeight = textHeight + paddingY * 2;
        
        const boxX = x - boxWidth / 2;
        const boxY = y - boxHeight / 2;

        // Manual Rounded rect for better compatibility
        const radius = 8 * scale;
        ctx.beginPath();
        ctx.moveTo(boxX + radius, boxY);
        ctx.lineTo(boxX + boxWidth - radius, boxY);
        ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + radius);
        ctx.lineTo(boxX + boxWidth, boxY + boxHeight - radius);
        ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - radius, boxY + boxHeight);
        ctx.lineTo(boxX + radius, boxY + boxHeight);
        ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - radius);
        ctx.lineTo(boxX, boxY + radius);
        ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
        ctx.closePath();
        ctx.fill();

        // Draw border
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2 * scale;
        ctx.stroke();

        // Draw text
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
        
        ctx.restore();
      };

      if (sceneOptions.showMainTitle && sceneOptions.mainTitle) {
        drawOverlay(
          sceneOptions.mainTitle, 
          sceneOptions.mainTitlePos || {x: 50, y: 20}, 
          48, true, '#ffffff', 0.6, 'rgba(16, 185, 129, 0.5)'
        );
      }
      if (sceneOptions.showSubtitle && sceneOptions.subtitle) {
        drawOverlay(
          sceneOptions.subtitle, 
          sceneOptions.subtitlePos || {x: 50, y: 35}, 
          32, false, '#e4e4e7', 0.6, 'rgba(16, 185, 129, 0.3)'
        );
      }
      if (sceneOptions.showBodyText && sceneOptions.bodyText) {
        const text = sceneOptions.bodyText;
        const lines = text.split('\n');
        const scale = canvas.width / 1280;
        const fontSize = 20;
        const lineHeight = fontSize * 1.4;
        
        lines.forEach((line, i) => {
          const yOffset = i * lineHeight;
          const currentPos = {
            x: sceneOptions.bodyTextPos?.x || 50,
            y: (sceneOptions.bodyTextPos?.y || 80) + (yOffset / canvas.height * 100)
          };
          drawOverlay(
            line, 
            currentPos, 
            fontSize, false, '#a1a1aa', 0.6, 'rgba(16, 185, 129, 0.2)'
          );
        });
      }

      // Trigger download using toBlob for better performance/reliability
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `ai-scene-${Date.now()}.png`;
        link.href = url;
        link.click();
        // Cleanup
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }, 'image/png');

    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to process image for download.');
    }
  };

  const updateSceneOption = (key: keyof SceneOptions, value: any) => {
    setSceneOptions(prev => ({ ...prev, [key]: value }));
  };

  const updatePerson = (index: number, key: keyof PersonConfig, value: any) => {
    const newPeople = [...sceneOptions.people];
    newPeople[index] = { ...newPeople[index], [key]: value };
    setSceneOptions(prev => ({ ...prev, people: newPeople }));
  };

  const addPerson = () => {
    if (sceneOptions.people.length < 6) {
      const newPeople = [...sceneOptions.people, createDefaultPerson()];
      setSceneOptions(prev => ({ 
        ...prev, 
        numPeople: newPeople.length,
        people: newPeople 
      }));
      setActivePersonIndex(newPeople.length - 1);
    }
  };

  const removePerson = (index: number) => {
    if (sceneOptions.people.length > 1) {
      const newPeople = sceneOptions.people.filter((_, i) => i !== index);
      setSceneOptions(prev => ({ 
        ...prev, 
        numPeople: newPeople.length,
        people: newPeople 
      }));
      setActivePersonIndex(Math.max(0, activePersonIndex - 1));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">AI Scene Studio</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
              <Info className="w-3 h-3" /> Guide
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Insurance Quick Banner Section */}
        <div className="mb-8 p-6 bg-zinc-900/50 border border-white/5 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> 保險業專屬 Banner 快速產生
              </h2>
              <p className="text-xs text-zinc-500 mt-1">選擇主題情境，一鍵產出專業保險宣傳圖</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {/* Custom Reference Upload */}
            <button
              onClick={() => referenceInputRef.current?.click()}
              disabled={isGenerating || isAnalyzing}
              className="group relative flex flex-col items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                {isAnalyzing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              </div>
              <span className="text-xs font-bold text-emerald-400">{isAnalyzing ? '分析中...' : '依圖模擬'}</span>
              <input
                type="file"
                ref={referenceInputRef}
                onChange={handleReferenceUpload}
                accept="image/*"
                className="hidden"
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-800 border border-white/10 rounded-lg text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                上傳參考圖片，AI將自動分析並模擬情境。
              </div>
            </button>

            {INSURANCE_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleQuickTheme(theme)}
                disabled={isGenerating}
                className="group relative flex flex-col items-center gap-3 p-4 bg-zinc-800/30 border border-white/5 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="p-3 rounded-lg bg-zinc-800 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                  <theme.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{theme.label}</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-800 border border-white/10 rounded-lg text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                  {theme.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
            {/* Global Scene Settings */}
            <div className="p-6 border-b border-white/5 space-y-4 bg-zinc-900/30">
              <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Settings2 className="w-4 h-4" /> Global Scene Settings
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Ethnicity</label>
                  <select
                    value={sceneOptions.ethnicity}
                    onChange={(e) => updateSceneOption('ethnicity', e.target.value)}
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50"
                  >
                    {ETHNICITIES.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Scene</label>
                  <select
                    value={SCENES.includes(sceneOptions.scene) ? sceneOptions.scene : 'Custom (自定義)'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Custom (自定義)') {
                        updateSceneOption('scene', '');
                      } else {
                        updateSceneOption('scene', val);
                      }
                    }}
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50"
                  >
                    {SCENES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {!SCENES.filter(s => s !== 'Custom (自定義)').includes(sceneOptions.scene) && (
                    <input
                      type="text"
                      placeholder="Enter custom scene..."
                      value={sceneOptions.scene}
                      onChange={(e) => updateSceneOption('scene', e.target.value)}
                      className="w-full bg-zinc-800/50 border border-emerald-500/30 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50 mt-2"
                    />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Style (風格)</label>
                  <select
                    value={STYLES.includes(sceneOptions.style) ? sceneOptions.style : 'Custom (自定義)'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Custom (自定義)') {
                        updateSceneOption('style', '');
                      } else {
                        updateSceneOption('style', val);
                        updateSceneOption('styleImage', undefined);
                      }
                    }}
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50"
                  >
                    {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {!STYLES.filter(s => s !== 'Custom (自定義)').includes(sceneOptions.style) && (
                    <div className="space-y-2 mt-2">
                      <input
                        type="text"
                        placeholder="Enter custom style description..."
                        value={sceneOptions.style}
                        onChange={(e) => updateSceneOption('style', e.target.value)}
                        className="w-full bg-zinc-800/50 border border-emerald-500/30 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-zinc-800/50 border border-white/5 rounded-lg text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                        >
                          <Upload className="w-3 h-3" />
                          {sceneOptions.styleImage ? 'Change Reference' : 'Upload Reference'}
                        </button>
                        {sceneOptions.styleImage && (
                          <button
                            onClick={() => updateSceneOption('styleImage', undefined)}
                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      {sceneOptions.styleImage && (
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-emerald-500/30">
                          <img 
                            src={sceneOptions.styleImage} 
                            alt="Style reference" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Weather (天氣)</label>
                  <select
                    value={sceneOptions.weather}
                    onChange={(e) => updateSceneOption('weather', e.target.value)}
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50"
                  >
                    {WEATHER.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Lighting</label>
                  <select
                    value={sceneOptions.lighting}
                    onChange={(e) => updateSceneOption('lighting', e.target.value)}
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50"
                  >
                    {LIGHTING_STYLES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Scene Time (場景時間)</label>
                  <select
                    value={sceneOptions.timeOfDay}
                    onChange={(e) => updateSceneOption('timeOfDay', e.target.value)}
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50"
                  >
                    {TIME_OF_DAY.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Camera Angle (鏡頭角度)</label>
                  <select
                    value={CAMERA_ANGLES.includes(sceneOptions.cameraAngle) ? sceneOptions.cameraAngle : 'Custom (自定義)'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Custom (自定義)') {
                        updateSceneOption('cameraAngle', '');
                      } else {
                        updateSceneOption('cameraAngle', val);
                        updateSceneOption('cameraAngleImage', undefined);
                      }
                    }}
                    className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50"
                  >
                    {CAMERA_ANGLES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  {!CAMERA_ANGLES.filter(a => a !== 'Custom (自定義)').includes(sceneOptions.cameraAngle) && (
                    <div className="space-y-2 mt-2">
                      <input
                        type="text"
                        placeholder="Enter custom camera angle description..."
                        value={sceneOptions.cameraAngle}
                        onChange={(e) => updateSceneOption('cameraAngle', e.target.value)}
                        className="w-full bg-zinc-800/50 border border-emerald-500/30 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => cameraAngleInputRef.current?.click()}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-zinc-800/50 border border-white/5 rounded-lg text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                        >
                          <Upload className="w-3 h-3" />
                          {sceneOptions.cameraAngleImage ? 'Change Reference' : 'Upload Reference'}
                        </button>
                        {sceneOptions.cameraAngleImage && (
                          <button
                            onClick={() => updateSceneOption('cameraAngleImage', undefined)}
                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={cameraAngleInputRef}
                        onChange={handleCameraAngleUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      {sceneOptions.cameraAngleImage && (
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-emerald-500/30">
                          <img 
                            src={sceneOptions.cameraAngleImage} 
                            alt="Camera angle reference" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest block">
                  Aspect Ratio (圖片比例)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {ASPECT_RATIOS.map(ar => (
                    <button
                      key={ar.value}
                      onClick={() => updateSceneOption('aspectRatio', ar.value)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-[9px] transition-all ${
                        (sceneOptions.aspectRatio || '16:9') === ar.value
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'bg-zinc-800/30 border-white/5 text-zinc-500 hover:border-white/20'
                      }`}
                    >
                      <span className="font-mono font-bold text-[10px]">{ar.value}</span>
                      <span className="text-[8px] opacity-70">{ar.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Text Overlay Settings */}
            <div className="p-6 border-b border-white/5 space-y-4 bg-zinc-900/30">
              <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Type className="w-4 h-4" /> Text Overlay Settings (文字疊加)
              </h2>
              
              <div className="space-y-4">
                {/* Main Title Toggle & Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Main Title (主標題)</label>
                    <button
                      onClick={() => updateSceneOption('showMainTitle', !sceneOptions.showMainTitle)}
                      className={`w-8 h-4 rounded-full transition-all relative ${sceneOptions.showMainTitle ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                    >
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${sceneOptions.showMainTitle ? 'left-4.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  {sceneOptions.showMainTitle && (
                    <input
                      type="text"
                      placeholder="Enter main title text..."
                      value={sceneOptions.mainTitle}
                      onChange={(e) => updateSceneOption('mainTitle', e.target.value)}
                      className="w-full bg-zinc-800/50 border border-emerald-500/30 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50"
                    />
                  )}
                </div>

                {/* Subtitle Toggle & Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Subtitle (次標題)</label>
                    <button
                      onClick={() => updateSceneOption('showSubtitle', !sceneOptions.showSubtitle)}
                      className={`w-8 h-4 rounded-full transition-all relative ${sceneOptions.showSubtitle ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                    >
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${sceneOptions.showSubtitle ? 'left-4.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  {sceneOptions.showSubtitle && (
                    <input
                      type="text"
                      placeholder="Enter subtitle text..."
                      value={sceneOptions.subtitle}
                      onChange={(e) => updateSceneOption('subtitle', e.target.value)}
                      className="w-full bg-zinc-800/50 border border-emerald-500/30 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50"
                    />
                  )}
                </div>

                {/* Body Text Toggle & Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Body Text (內文)</label>
                    <button
                      onClick={() => updateSceneOption('showBodyText', !sceneOptions.showBodyText)}
                      className={`w-8 h-4 rounded-full transition-all relative ${sceneOptions.showBodyText ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                    >
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${sceneOptions.showBodyText ? 'left-4.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  {sceneOptions.showBodyText && (
                    <textarea
                      placeholder="Enter body text..."
                      value={sceneOptions.bodyText}
                      onChange={(e) => updateSceneOption('bodyText', e.target.value)}
                      className="w-full bg-zinc-800/50 border border-emerald-500/30 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50 min-h-[60px] resize-none"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* People Management */}
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4" /> People ({sceneOptions.people.length}/6)
                </h2>
                <button 
                  onClick={addPerson}
                  disabled={sceneOptions.people.length >= 6}
                  className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-md hover:bg-emerald-500/20 disabled:opacity-30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Person Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {sceneOptions.people.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePersonIndex(i)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 ${
                      activePersonIndex === i 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                        : 'bg-zinc-800/30 border-white/5 text-zinc-500 hover:border-white/10'
                    }`}
                  >
                    Person {i + 1}
                    {sceneOptions.people.length > 1 && (
                      <Trash2 
                        className="w-3 h-3 hover:text-red-400" 
                        onClick={(e) => {
                          e.stopPropagation();
                          removePerson(i);
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Active Person Config */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePersonIndex}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4 bg-zinc-800/20 p-4 rounded-xl border border-white/5"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Identity</label>
                      <select
                        value={sceneOptions.people[activePersonIndex].identity}
                        onChange={(e) => updatePerson(activePersonIndex, 'identity', e.target.value)}
                        className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 px-3 text-xs"
                      >
                        {IDENTITIES.map(id => <option key={id} value={id}>{id}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Gender</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updatePerson(activePersonIndex, 'gender', 'male')}
                          className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${
                            sceneOptions.people[activePersonIndex].gender === 'male' 
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                              : 'bg-zinc-800/30 border-white/5 text-zinc-500'
                          }`}
                        >
                          Male
                        </button>
                        <button
                          onClick={() => updatePerson(activePersonIndex, 'gender', 'female')}
                          className={`flex-1 py-2 rounded-lg text-[10px] border transition-all ${
                            sceneOptions.people[activePersonIndex].gender === 'female' 
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                              : 'bg-zinc-800/30 border-white/5 text-zinc-500'
                          }`}
                        >
                          Female
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Age</label>
                        <span className="text-[10px] text-emerald-400">{sceneOptions.people[activePersonIndex].age}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={sceneOptions.people[activePersonIndex].age}
                        onChange={(e) => updatePerson(activePersonIndex, 'age', parseInt(e.target.value))}
                        className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Action</label>
                      <select
                        value={ACTIONS.includes(sceneOptions.people[activePersonIndex].action) ? sceneOptions.people[activePersonIndex].action : 'Custom (自定義)'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'Custom (自定義)') {
                            updatePerson(activePersonIndex, 'action', '');
                          } else {
                            updatePerson(activePersonIndex, 'action', val);
                          }
                        }}
                        className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 px-3 text-xs"
                      >
                        {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                      {!ACTIONS.filter(a => a !== 'Custom (自定義)').includes(sceneOptions.people[activePersonIndex].action) && (
                        <input
                          type="text"
                          placeholder="Enter custom action..."
                          value={sceneOptions.people[activePersonIndex].action}
                          onChange={(e) => updatePerson(activePersonIndex, 'action', e.target.value)}
                          className="w-full bg-zinc-800/50 border border-emerald-500/30 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50 mt-2"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Hair Color</label>
                      <select
                        value={sceneOptions.people[activePersonIndex].hairColor}
                        onChange={(e) => updatePerson(activePersonIndex, 'hairColor', e.target.value)}
                        className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 px-3 text-xs"
                      >
                        {HAIR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Hair Style</label>
                      <select
                        value={HAIR_STYLES.includes(sceneOptions.people[activePersonIndex].hairStyle) ? sceneOptions.people[activePersonIndex].hairStyle : 'Custom (自定義)'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'Custom (自定義)') {
                            updatePerson(activePersonIndex, 'hairStyle', '');
                          } else {
                            updatePerson(activePersonIndex, 'hairStyle', val);
                          }
                        }}
                        className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 px-3 text-xs"
                      >
                        {HAIR_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {!HAIR_STYLES.filter(s => s !== 'Custom (自定義)').includes(sceneOptions.people[activePersonIndex].hairStyle) && (
                        <input
                          type="text"
                          placeholder="Enter custom hair style..."
                          value={sceneOptions.people[activePersonIndex].hairStyle}
                          onChange={(e) => updatePerson(activePersonIndex, 'hairStyle', e.target.value)}
                          className="w-full bg-zinc-800/50 border border-emerald-500/30 rounded-lg py-2 px-3 text-xs mt-2"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Body Build</label>
                      <select
                        value={sceneOptions.people[activePersonIndex].bodyBuild}
                        onChange={(e) => updatePerson(activePersonIndex, 'bodyBuild', e.target.value)}
                        className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 px-3 text-xs"
                      >
                        {BODY_BUILDS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">面對的角度 (Facing Angle)</label>
                      <select
                        value={sceneOptions.people[activePersonIndex].facingAngle}
                        onChange={(e) => updatePerson(activePersonIndex, 'facingAngle', e.target.value)}
                        className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 px-3 text-xs"
                      >
                        {FACING_ANGLES.map(angle => <option key={angle} value={angle}>{angle}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Clothing</label>
                      <select
                        value={CLOTHING_STYLES.includes(sceneOptions.people[activePersonIndex].clothing) ? sceneOptions.people[activePersonIndex].clothing : 'Custom (自定義)'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'Custom (自定義)') {
                            updatePerson(activePersonIndex, 'clothing', '');
                          } else {
                            updatePerson(activePersonIndex, 'clothing', val);
                          }
                        }}
                        className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 px-3 text-xs"
                      >
                        {CLOTHING_STYLES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {!CLOTHING_STYLES.filter(c => c !== 'Custom (自定義)').includes(sceneOptions.people[activePersonIndex].clothing) && (
                        <input
                          type="text"
                          placeholder="Enter custom clothing..."
                          value={sceneOptions.people[activePersonIndex].clothing}
                          onChange={(e) => updatePerson(activePersonIndex, 'clothing', e.target.value)}
                          className="w-full bg-zinc-800/50 border border-emerald-500/30 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50 mt-2"
                        />
                      )}
                    </div>

                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">是否有使用輔具 (Assistive Device)</label>
                      <select
                        value={ASSISTIVE_DEVICES.includes(sceneOptions.people[activePersonIndex].assistiveDevice) ? sceneOptions.people[activePersonIndex].assistiveDevice : 'Custom (自定義)'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'Custom (自定義)') {
                            updatePerson(activePersonIndex, 'assistiveDevice', '');
                          } else {
                            updatePerson(activePersonIndex, 'assistiveDevice', val);
                          }
                        }}
                        className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 px-3 text-xs"
                      >
                        {ASSISTIVE_DEVICES.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      {!ASSISTIVE_DEVICES.filter(d => d !== 'Custom (自定義)').includes(sceneOptions.people[activePersonIndex].assistiveDevice) && (
                        <input
                          type="text"
                          placeholder="Enter custom assistive device..."
                          value={sceneOptions.people[activePersonIndex].assistiveDevice}
                          onChange={(e) => updatePerson(activePersonIndex, 'assistiveDevice', e.target.value)}
                          className="w-full bg-zinc-800/50 border border-emerald-500/30 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50 mt-2"
                        />
                      )}
                    </div>

                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Custom Prompt (客製化提示詞)</label>
                      <textarea
                        placeholder="Enter additional details for this person (e.g., specific facial features, accessories, pose details)..."
                        value={sceneOptions.people[activePersonIndex].customPrompt || ''}
                        onChange={(e) => updatePerson(activePersonIndex, 'customPrompt', e.target.value)}
                        className="w-full bg-zinc-800/50 border border-white/5 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-emerald-500/50 min-h-[80px] resize-none"
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Generate Button */}
            <div className="p-6 bg-zinc-900/80 border-t border-white/5">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                  isGenerating 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                    : 'bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.98] shadow-lg shadow-emerald-500/20'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating Scene...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Generate Scene
                  </>
                )}
              </button>
              {error && (
                <p className="mt-4 text-xs text-red-400 text-center font-medium">{error}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 space-y-6">
            <div 
              ref={previewContainerRef}
              className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden relative group"
              style={{
                aspectRatio: (sceneOptions.aspectRatio || '16:9').replace(':', '/'),
                maxHeight: '75vh',
                width: ['9:16','2:3','3:4','1:2'].includes(sceneOptions.aspectRatio || '16:9') ? 'auto' : '100%',
              }}
            >
              {generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Generated Scene" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 p-12 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-zinc-800/50 flex items-center justify-center">
                    <Users className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-zinc-400 font-medium">No Scene Generated</h3>
                    <p className="text-sm text-zinc-600 mt-1">Configure your characters and scene on the left, then click generate.</p>
                  </div>
                </div>
              )}

              {/* Draggable Text Overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {sceneOptions.showMainTitle && (
                  <motion.div
                    drag
                    dragMomentum={false}
                    dragSnapToOrigin={true}
                    dragConstraints={previewContainerRef}
                    dragElastic={0}
                    onDragEnd={(_, info) => {
                      if (previewContainerRef.current) {
                        const rect = previewContainerRef.current.getBoundingClientRect();
                        // Calculate the relative movement as a percentage
                        const deltaX = (info.offset.x / rect.width) * 100;
                        const deltaY = (info.offset.y / rect.height) * 100;
                        
                        const currentX = sceneOptions.mainTitlePos?.x ?? 50;
                        const currentY = sceneOptions.mainTitlePos?.y ?? 20;
                        
                        updateSceneOption('mainTitlePos', { 
                          x: Math.max(0, Math.min(100, currentX + deltaX)), 
                          y: Math.max(0, Math.min(100, currentY + deltaY)) 
                        });
                      }
                    }}
                    style={{ 
                      position: 'absolute', 
                      left: `${sceneOptions.mainTitlePos?.x ?? 50}%`, 
                      top: `${sceneOptions.mainTitlePos?.y ?? 20}%`,
                      translateX: '-50%',
                      translateY: '-50%',
                      zIndex: 50
                    }}
                    className="pointer-events-auto cursor-move select-none"
                  >
                    <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-emerald-500/50 rounded-md text-white font-bold text-lg whitespace-nowrap shadow-xl">
                      {sceneOptions.mainTitle || 'Main Title'}
                    </div>
                  </motion.div>
                )}

                {sceneOptions.showSubtitle && (
                  <motion.div
                    drag
                    dragMomentum={false}
                    dragSnapToOrigin={true}
                    dragConstraints={previewContainerRef}
                    dragElastic={0}
                    onDragEnd={(_, info) => {
                      if (previewContainerRef.current) {
                        const rect = previewContainerRef.current.getBoundingClientRect();
                        const deltaX = (info.offset.x / rect.width) * 100;
                        const deltaY = (info.offset.y / rect.height) * 100;
                        
                        const currentX = sceneOptions.subtitlePos?.x ?? 50;
                        const currentY = sceneOptions.subtitlePos?.y ?? 35;
                        
                        updateSceneOption('subtitlePos', { 
                          x: Math.max(0, Math.min(100, currentX + deltaX)), 
                          y: Math.max(0, Math.min(100, currentY + deltaY)) 
                        });
                      }
                    }}
                    style={{ 
                      position: 'absolute', 
                      left: `${sceneOptions.subtitlePos?.x ?? 50}%`, 
                      top: `${sceneOptions.subtitlePos?.y ?? 35}%`,
                      translateX: '-50%',
                      translateY: '-50%',
                      zIndex: 50
                    }}
                    className="pointer-events-auto cursor-move select-none"
                  >
                    <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-emerald-500/30 rounded-md text-zinc-200 text-sm whitespace-nowrap shadow-lg">
                      {sceneOptions.subtitle || 'Subtitle'}
                    </div>
                  </motion.div>
                )}

                {sceneOptions.showBodyText && (
                  <motion.div
                    drag
                    dragMomentum={false}
                    dragSnapToOrigin={true}
                    dragConstraints={previewContainerRef}
                    dragElastic={0}
                    onDragEnd={(_, info) => {
                      if (previewContainerRef.current) {
                        const rect = previewContainerRef.current.getBoundingClientRect();
                        const deltaX = (info.offset.x / rect.width) * 100;
                        const deltaY = (info.offset.y / rect.height) * 100;
                        
                        const currentX = sceneOptions.bodyTextPos?.x ?? 50;
                        const currentY = sceneOptions.bodyTextPos?.y ?? 80;
                        
                        updateSceneOption('bodyTextPos', { 
                          x: Math.max(0, Math.min(100, currentX + deltaX)), 
                          y: Math.max(0, Math.min(100, currentY + deltaY)) 
                        });
                      }
                    }}
                    style={{ 
                      position: 'absolute', 
                      left: `${sceneOptions.bodyTextPos?.x ?? 50}%`, 
                      top: `${sceneOptions.bodyTextPos?.y ?? 80}%`,
                      translateX: '-50%',
                      translateY: '-50%',
                      zIndex: 50
                    }}
                    className="pointer-events-auto cursor-move select-none max-w-[200px]"
                  >
                    <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-emerald-500/20 rounded-md text-zinc-400 text-[10px] leading-tight shadow-md">
                      {sceneOptions.bodyText || 'Body text content goes here...'}
                    </div>
                  </motion.div>
                )}
              </div>

              {generatedImage && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 pointer-events-none">
                  <button 
                    onClick={handleDownload}
                    className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform pointer-events-auto shadow-xl"
                    title="Download with Text Overlays"
                  >
                    <Download className="w-6 h-6" />
                  </button>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-400 font-bold tracking-widest uppercase text-xs">Synthesizing Multi-Person Scene</p>
                    <p className="text-zinc-500 text-[10px] mt-2 font-mono">Coordinating character interactions...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Scene Summary</h4>
                {generatedImage && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-lg text-xs font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Download className="w-4 h-4" />
                    Download Synthesized Image
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500">Scene</p>
                  <p className="text-xs font-medium truncate" title={sceneOptions.scene}>{sceneOptions.scene}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500">People</p>
                  <p className="text-xs font-medium">{sceneOptions.numPeople}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500">Ethnicity</p>
                  <p className="text-xs font-medium">{sceneOptions.ethnicity}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500">Style</p>
                  <p className="text-xs font-medium truncate" title={sceneOptions.style}>{sceneOptions.style}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500">Weather</p>
                  <p className="text-xs font-medium">{sceneOptions.weather}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500">Lighting</p>
                  <p className="text-xs font-medium">{sceneOptions.lighting}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500">Angle</p>
                  <p className="text-xs font-medium truncate" title={sceneOptions.cameraAngle}>{sceneOptions.cameraAngle}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500">Time</p>
                  <p className="text-xs font-medium truncate" title={sceneOptions.timeOfDay}>{sceneOptions.timeOfDay}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-zinc-500 font-mono">© 2026 AI Scene Studio. Powered by Gemini.</p>
          <div className="flex gap-8">
            <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
