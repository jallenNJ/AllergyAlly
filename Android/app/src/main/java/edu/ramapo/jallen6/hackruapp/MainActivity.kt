package edu.ramapo.jallen6.hackruapp

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.view.View

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }

    fun goToImageUpload(view: View){
        val intent = Intent(view.context, UploadImage::class.java)
        startActivity(intent)
        finish()
    }
}
