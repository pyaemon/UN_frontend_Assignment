import { Provider } from "react-redux";
import { store } from "./redux/store";
import { PhotoGallery } from "./features/photos/PhotoGallery";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <div className="app-container">
        <main className="app-content">
          <PhotoGallery />
        </main>
        {/* <footer className="app-footer">
          <p>© {new Date().getFullYear()} Gallary App. All rights reserved.</p>
        </footer> */}
      </div>
    </Provider>
  );
}

export default App;
