package edu.ramapo.jallen6.hackruapp;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.LinearLayout;
import android.widget.TextView;
import org.json.JSONArray;
import org.json.JSONException;

public class MenuItems extends AppCompatActivity {
    public static final String ITEM_EXTRA = "items";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu_items);
        //EdibleFood
        String arrData = getIntent().getStringExtra(ITEM_EXTRA);
        JSONArray arr;
        try {
             arr = new JSONArray(arrData);
        } catch (JSONException e) {
            e.printStackTrace();
            Intent backToUpload = new Intent(this, UploadImage.class);
            startActivity(backToUpload);
            finish();
            return;
        }

        LinearLayout layout = findViewById(R.id.menuItems_Layout);
        for(int i =0; i < arr.length(); i++){
            String item;
            try{
                 item = arr.getString(i);

            } catch (JSONException e) {
                e.printStackTrace();
                continue;
            }
            TextView listItem = new TextView(this);
            listItem.setText(item);
            layout.addView(listItem);
        }


    }
}
