package edu.ramapo.jallen6.hackruapp;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;



public class MenuItems extends AppCompatActivity {

    public static final String ITEM_EXTRA = "items";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu_items);

        String arrData = getIntent().getStringExtra(ITEM_EXTRA);

        if(arrData == null || arrData.length() == 0){
            Intent backToUpload = new Intent(this, UploadImage.class);
            startActivity(backToUpload);
            finish();
            return;

        }
        arrData= arrData.trim();
        String[] arr = arrData.substring(1, arrData.length()-1).split(",");

        LinearLayout layout = findViewById(R.id.menuItems_Layout);
        for(String allergen:arr){

            TextView listItem = new TextView(this);
            listItem.setText(allergen.trim().replace("'",""));
            listItem.setGravity(View.TEXT_ALIGNMENT_CENTER);
            layout.addView(listItem);
        }


    }

    public void goBack(View v){
        finish();
    }
}
