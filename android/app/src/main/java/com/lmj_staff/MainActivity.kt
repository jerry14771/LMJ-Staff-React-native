package com.lmj_staff

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.view.WindowManager
import android.os.Bundle
import android.os.Handler
import android.database.ContentObserver
import android.provider.MediaStore
import android.widget.Toast

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "LMJ_Staff"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Prevent screenshots
    window.setFlags(
      WindowManager.LayoutParams.FLAG_SECURE,
      WindowManager.LayoutParams.FLAG_SECURE
    )

    // Register content observer to detect screenshot attempts
    contentResolver.registerContentObserver(
      MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
      true,
      object : ContentObserver(Handler()) {
        override fun onChange(selfChange: Boolean) {
          super.onChange(selfChange)
          Toast.makeText(
            this@MainActivity,
            "Screenshots are disabled in this app for privacy reasons.",
            Toast.LENGTH_LONG
          ).show()
        }
      }
    )
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flag [fabricEnabled].
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
