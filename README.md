# React 3D Building Project

This project demonstrates a 3D web application where users can interact with and dynamically add 3D models (e.g., buildings, bikes, roads etc.) to a canvas, along with functionality for calculating ETAs from an ETA predictor model for a bike to handle deliveries between buildings, displaying information in a side panel, and managing assets within a containerized Docker setup.

---

## Features
- **Interactive 3D Canvas**: Add, modify, and remove 3D building models using mouse interactions.
- **ETA Prediction**: Predict the estimated time of arrival (ETA) for bikes in the application and display this data dynamically beside corresponding elements.
- **Side Panel**: Dynamically update and display categorized elements in collapsible dropdown lists.
- **Containerized Application**: The app is fully containerized using Docker and serves static assets with `serve`.

---

## Getting Started

### Prerequisites
- **Node.js**: Install the latest LTS version.
- **Docker**: Install Docker Desktop for containerization.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/DReaper55/eta-simulator.git
   cd eta-simulator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application locally:
   ```bash
   npm start
   ```

---

## Deployment with Docker

### Building and Running the Docker Image
1. Build the Docker image:
   ```bash
   docker build -t eta-simulator .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 eta-simulator
   ```

3. Access the application in your browser at `http://localhost:3000`.

---

## Directory Structure
```
src/
├── assets/                  # Static assets (models, JSON files, etc.)
├── components/              # React components
├── store/                   # Redux store and slices
├── utils/                   # Helper functions and utilities
└── App.tsx                  # Main application entry point
```

---

## Asset Paths
Static assets are stored in the `public` directory for easy resolution. Update asset paths as follows:
```javascript
export const AssetPaths = {
  BUILDING_MODEL: '/assets/models/building.glb',
  ETA_MODEL: '/assets/model.json',
  ETA_MODEL_MEAN: '/assets/mean.json',
  ETA_MODEL_SCALE: '/assets/scale.json',
  ETA_MODEL_WEIGHTS: '/assets/weights.bin',
};
```

Ensure assets are in the `public/assets` directory for correct loading.

---

## Troubleshooting

### Asset Not Loading
- Verify the asset paths in the browser developer tools.
- Ensure the assets are copied into the `public/assets` directory.

### Docker Issues
- Inspect the container's `dist` directory to verify the presence of static files:
  ```bash
  docker exec -it <container-id> sh
  ls /app/dist/assets
  ```

---

## Future Improvements
- Add functionality for scaling and rotating 3D models.
- Implement backend APIs for managing dynamic data.
- Improve mobile responsiveness.

---

## Contributing
Feel free to open issues or submit pull requests for any enhancements or fixes.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.