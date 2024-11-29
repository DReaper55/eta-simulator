import * as tf from "@tensorflow/tfjs";
import { AssetPaths } from "../assets";


interface ScalerData {
  mean: number[];
  scale: number[];
}

const loadScalerData = async (): Promise<ScalerData> => {
  const [meanResponse, scaleResponse] = await Promise.all([
    fetch(AssetPaths.ETA_MODEL_MEAN),
    fetch(AssetPaths.ETA_MODEL_SCALE),
  ]);

  const mean = await meanResponse.json();
  const scale = await scaleResponse.json();

  return { mean, scale };
};

const scaleFeatures = (
  features: number[],
  mean: number[],
  scale: number[]
): number[] => {
  return features.map(
    (feature, index) => (feature - mean[index]) / scale[index]
  );
};


let model: tf.LayersModel | null = null;

const loadModel = async (): Promise<tf.LayersModel> => {
  if (!model) {
    model = await tf.loadLayersModel(AssetPaths.ETA_MODEL);
  }
  return model;
};

export async function predictETA(features: number[]): Promise<number> {
  // Load model and scaler data
  const [loadedModel, { mean, scale }] = await Promise.all([
    loadModel(),
    loadScalerData(),
  ]);

  const scaledFeatures = scaleFeatures(features, mean, scale);

  // Create input tensor
  const inputTensor = tf.tensor3d(
    [scaledFeatures.map((f) => [f])],
    [1, scaledFeatures.length, 1]
  );

  // Perform prediction
  let prediction = loadedModel.predict(inputTensor) as tf.Tensor;

  // Handle prediction if it is an array
  if (Array.isArray(prediction)) {
    prediction = tf.stack(prediction);
  }

  const eta = prediction.dataSync()

  // Clean up tensors to avoid memory leaks
  inputTensor.dispose();
  prediction.dispose();

  return eta[0]
}
