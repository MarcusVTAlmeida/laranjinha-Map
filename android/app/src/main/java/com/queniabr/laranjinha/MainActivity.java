package com.queniabr.laranjinha;

import android.os.Bundle;
import expo.adapters.react.ModuleRegistryAdapter;
import expo.adapters.react.ReactAdapterPackage;
import expo.adapters.react.ReactModuleRegistryProvider;
import expo.core.interfaces.Package;
import expo.modules.firebase.app.FirebaseAppPackage; // This should be here for all Expo Firebase features. 
import expo.modules.firebase.firestore.FirebaseFirestorePackage;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import expo.modules.firebase.app.FirebaseAppPackage; // This should be here for all Expo Firebase features. 
import expo.modules.firebase.database.FirebaseDatabasePackage;
import expo.modules.splashscreen.singletons.SplashScreen;
import expo.modules.splashscreen.SplashScreenImageResizeMode;

public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // SplashScreen.show(...) has to be called after super.onCreate(...)
    // Below line is handled by '@expo/configure-splash-screen' command and it's discouraged to modify it manually
    SplashScreen.show(this, SplashScreenImageResizeMode.CONTAIN, ReactRootView.class, false);
  }
  @Override
  public List<Package> expoPackages() {
    // Here you can add your own packages. 
    return Arrays.<Package>asList(
      new FirebaseAppPackage(), // This should be here for all Expo Firebase features. 
      new FirebaseFirestorePackage() // Include this. 
    );
  }

  @Override
public List<Package> expoPackages() {
  // Here you can add your own packages. 
  return Arrays.<Package>asList(
    new FirebaseAppPackage(), // This should be here for all Expo Firebase features. 
    new FirebaseDatabasePackage() // Include this. 
  );
}


    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "main";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
 private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(Arrays.<Package>asList(
    new ReactAdapterPackage()
    // more packages, like 
    // new CameraPackage(), if you use expo-camera 
    // etc. 
), /* singletonModules */ null);
        };
    }
}
