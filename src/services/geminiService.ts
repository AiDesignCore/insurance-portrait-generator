import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '' });

export interface PersonConfig {
  identity: string;
  gender: string;
  age: string;
  action: string;
  clothing: string;
  bodyBuild: string;
  hairStyle: string;
  hairColor: string;
  facingAngle: string;
  assistiveDevice: string;
  customPrompt?: string;
}

export interface SceneOptions {
  numPeople: number;
  people: PersonConfig[];
  ethnicity: string;
  scene: string;
  lighting: string;
  style: string;
  styleImage?: string; // Base64 encoded image
  cameraAngle: string;
  cameraAngleImage?: string; // Base64 encoded image
  timeOfDay: string;
  weather: string;
  showMainTitle?: boolean;
  mainTitle?: string;
  mainTitlePos?: { x: number; y: number };
  showSubtitle?: boolean;
  subtitle?: string;
  subtitlePos?: { x: number; y: number };
  showBodyText?: boolean;
  bodyText?: string;
  bodyTextPos?: { x: number; y: number };
  aspectRatio?: string;
}

export async function generatePortrait(options: SceneOptions) {
  const peopleDescriptions = options.people.map((p, i) => {
    const isRobot = p.identity.toLowerCase().includes('robot') || p.identity.includes('機器人');
    const robotInfo = isRobot ? 'This character is a robot. Adjust facial features and body parts to be robotic accordingly.' : '';
    return `Person ${i + 1} (${p.identity}): A ${p.gender}, ${p.age} years old, ${p.bodyBuild} build. Facing Angle: ${p.facingAngle}. Hair Style: ${p.hairStyle}, ${p.hairColor}. Wearing: ${p.clothing}. Action: ${p.action}. Assistive Device: ${p.assistiveDevice}. ${robotInfo} ${p.customPrompt ? `Additional details: ${p.customPrompt}.` : ''}`;
  }).join(' ');

  const styleSpecifics = options.style === 'Photorealistic (照片寫實)' 
    ? 'photorealistic, 8k resolution, detailed skin texture' 
    : options.style === 'Cartoon (卡通風)'
    ? 'clean line-art, flat colors, cute character design, friendly and simple facial expressions, vibrant colors, similar to modern mascot illustration'
    : options.style === '仿真機器人 (Realistic Robot)'
    ? 'sleek humanoid robot with detailed mechanical parts, brushed metal surfaces, glowing LED accents, realistic robotic form, sophisticated technology aesthetic'
    : options.style === '可愛卡通機器人 (Cute Cartoon Robot)'
    ? 'chibi-style cute robot, rounded shapes, expressive digital eyes on a screen, friendly appearance, colorful plastic or smooth metal finish, charming mascot aesthetic, simple and clean design'
    : 'professional artistic style';

  const sceneSpecifics = options.scene.includes('Blue Screen') 
    ? 'The background must be a solid, uniform chroma-key blue color (#0047BB) with no shadows, textures, or objects, suitable for professional background removal/composition.'
    : `Scene Details: ${options.scene}.`;

  const prompt = `A highly professional image in ${options.style} style, featuring ${options.numPeople} people in a ${options.scene} setting. 
    Overall Ethnicity: ${options.ethnicity}.
    ${sceneSpecifics}
    Time of Day: ${options.timeOfDay}.
    Weather: ${options.weather}.
    Lighting: ${options.lighting}.
    Style: ${options.style}. ${styleSpecifics}.
    ${options.styleImage ? 'Please follow the visual style and artistic direction of the attached style reference image.' : ''}
    Camera Angle: ${options.cameraAngle}.
    ${options.cameraAngleImage ? 'Please strictly follow the camera angle, perspective, and character positioning/action shown in the attached camera reference image.' : ''}
    People in the scene:
    ${peopleDescriptions}
    The image should be high quality, sharp focus, ${styleSpecifics}. All people should be interacting naturally within the ${options.scene} environment. The time of day is ${options.timeOfDay}, the weather is ${options.weather}, and the camera angle is ${options.cameraAngle}.`;

  try {
    const parts: any[] = [{ text: prompt }];
    
    if (options.styleImage) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: options.styleImage.split(',')[1]
        }
      });
    }

    if (options.cameraAngleImage) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: options.cameraAngleImage.split(',')[1]
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from Gemini");
  } catch (error) {
    console.error("Error generating portrait:", error);
    throw error;
  }
}

export async function analyzeImage(imageBase64: string): Promise<Partial<SceneOptions>> {
  try {
    const prompt = `Analyze this image for an insurance banner generation tool. Extract the following details in JSON format:
    - numPeople (number)
    - ethnicity (string, one of: Taiwanese (台灣人), East Asian, Caucasian, African, Hispanic, South Asian, Middle Eastern)
    - scene (string, try to match: Natural Park (自然公園), Qingtiangang Grassland (擎天崗草原), Park (公園), Amusement Park (遊樂場), Room (房間), Rehabilitation Center (復健中心), City Street (城市街道), Cafe (咖啡廳), Seaside (海邊), Beach (沙灘), Company (公司), Living Room (客廳), Hospital (醫院), Mountain Climbing (登山), Yacht (遊艇), Swimming Pool (泳池), Riverside (溪邊), Hill (小山), Trail (步道))
    - lighting (string, one of: Soft Studio, Natural Sunlight, Golden Hour, Moody Low-key, Bright Interior)
    - style (string, match one of: Photorealistic (照片寫實), Cinematic (電影感), 3D PAPER CRAFT (紙模型), Paper Cut (紙雕風), Cartoon (卡通風), 仿真機器人 (Realistic Robot), 可愛卡通機器人 (Cute Cartoon Robot), etc)
    - timeOfDay (string, one of: Early Morning (清晨), Noon (中午), Daytime (白天), Evening (晚上), Late Night (深夜))
    - weather (string, one of: Sunny (晴天), Cloudy (多雲), Rainy (下雨), Snowy (下雪), Foggy (大霧), Stormy (暴風雨))
    - people (array of objects with: identity, gender (male/female), age (approx number), action, facingAngle (front/back/right/left), clothing, bodyBuild, hairStyle, hairColor, assistiveDevice)
    
    Only return the JSON object.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64.split(',')[1]
            }
          }
        ]
      }
    });

    const text = response.text || "";
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error analyzing image:", error);
    return {};
  }
}
