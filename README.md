# Toronto Vehicle Charging Location Finder  

## Overview  
The **Toronto Vehicle Charging Location Finder** is a web-based application designed to help users in Toronto locate nearby vehicle charging stations. It provides an interactive map where users can share their current location, select a number of charging stations, and receive suggestions for the closest stations.  

This project integrates modern web development tools and geospatial technologies to deliver a seamless user experience.  

---

## Features  
- **Share Current Location**: Users can share their real-time location to find charging stations nearby.  
- **Charging Station Selection**: Specify the number of nearby stations you wish to locate.  
- **Optimized Proximity Search**: The app identifies and displays the closest charging stations based on the user’s location.  
- **Interactive Mapping**: Smooth, interactive map interface with zoom, pan, and station markers.  
- **Scalable Back-End**: Built with FastAPI for fast and reliable API handling.  
- **Spatial Queries**: Efficient location processing powered by PostgreSQL with PostGIS extension.  

---

## Technology Stack  
### Front-End:  
- **LeafletJS**: For rendering and managing the interactive map.  
- **JavaScript**: For implementing dynamic user interactions and map controls.  

### Back-End:  
- **FastAPI**: To handle API requests and location-based logic.  

### Database:  
- **PostgreSQL with PostGIS**: For spatial data storage and advanced location queries.  

---

## Installation and Setup  

### Prerequisites:  
- Python 3.8 or higher  
- PostgreSQL with PostGIS extension  

### Steps:  

1. **Clone the Repository**:  
   ```bash
   git clone <repository-url>
   cd easycharge
   ```  

2. **Set Up the Database**:  
   - Install PostgreSQL and enable the PostGIS extension.  
   - Create a database and populate it with charging station data using the provided scripts.  

3. **Install Back-End Dependencies**:  
   ```bash
   pip install -r packages.txt
   ```  

4. **Start the Back-End Server**:  
   ```bash
   python app.py
   ```  
5. **Access the Application**:  
   Open your browser and navigate to `http://127.0.0.1:5000`.  

---

## Usage  
1. Open the application in your browser.  
2. Share your location by clicking the "Share Location" button.  
3. Specify the number of charging stations you want to find.  
4. View the closest charging stations highlighted on the map.  

---

## Contributing  
Contributions are welcome! Please follow these steps:  
1. Fork the repository.  
2. Create a new branch:  
   ```bash
   git checkout -b feature-name
   ```  
3. Commit your changes:  
   ```bash
   git commit -m "Add feature description"
   ```  
4. Push to your branch:  
   ```bash
   git push origin feature-name
   ```  
5. Open a pull request.  

---

## License  
This project is licensed under the [MIT License](LICENSE).  

---

## Acknowledgments  
- **LeafletJS** for the mapping library.  
- **FastAPI** for the high-performance back-end framework.  
- **PostgreSQL/PostGIS** for spatial data processing.  
- Toronto residents for inspiring the use case.  

---  

Feel free to reach out for questions, suggestions, or contributions!
