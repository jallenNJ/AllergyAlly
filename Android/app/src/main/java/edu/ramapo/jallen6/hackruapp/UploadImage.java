package edu.ramapo.jallen6.hackruapp;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Debug;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;

public class UploadImage extends AppCompatActivity {

    private final static int LOAD_IMG = 1;

    private Bitmap selectedImage;
    ImageView selectedPhoto;

    private int[] checkBoxIds;
    private String[][] checkBoxText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_upload_image);

        selectedPhoto = findViewById(R.id.uploadImageSelectedImage);

        checkBoxIds = new int[] {R.id.eggCheck, R.id.milkCheck, R.id.fishCheck, R.id.shellFishCheckbox,
                R.id.treeNutCheckBox, R.id.peanutCheckBox, R.id.wheatCheck, R.id.soyCheck, R.id.chocolateCheck};

        checkBoxText = new String[][] {{"Egg", "Eggs"}, {"Milk"}, {"Fish"}, {"ShellFish"}, {"Tree Nut"},
                {"Peanut"}, {"Wheat"}, {"Soy"}, {"Chocolate" , "Cocoa"}};

        findViewById(R.id.uploadImageSelectedImage).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                chooseImage(view);
            }
        });
    }


    @Override
    protected void onActivityResult(int reqCode, int resultCode, Intent data) {
        super.onActivityResult(reqCode, resultCode, data);


        if (resultCode == RESULT_OK) {
            try {
                final Uri imageUri = data.getData();
                if(imageUri == null){
                    Log.e("NullCheck", "imageURI (Selected image) was null");
                    return;
                }
                final InputStream imageStream = getContentResolver().openInputStream(imageUri);
                selectedImage = BitmapFactory.decodeStream(imageStream);

                selectedPhoto.setImageBitmap(selectedImage);

                findViewById(R.id.uploadImage_ChooseButton).setVisibility(View.GONE);
                findViewById(R.id.uploadImage_UploadButton).setVisibility(View.VISIBLE);




            } catch (FileNotFoundException e) {
                e.printStackTrace();
                Toast.makeText(this, "Something went wrong", Toast.LENGTH_LONG).show();
            }

        }else {
            Toast.makeText(this, "You haven't picked Image",Toast.LENGTH_LONG).show();
        }
    }



    public String getStringImage(Bitmap bmp) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.PNG, 100, baos);
        return Base64.encodeToString(baos.toByteArray(), Base64.DEFAULT);

    }


    public void chooseImage(View v){
        Intent photoPickerIntent = new Intent(Intent.ACTION_PICK);
        photoPickerIntent.setType("image/*");
        startActivityForResult(photoPickerIntent, LOAD_IMG);
    }

    public void uploadImage(View v){
        String base64Image = getStringImage(selectedImage);

        //Log.i("ImageString", base64Image);
        ArrayList<String> allergens = new ArrayList<>();
        for(int i =0; i < checkBoxIds.length; i++){
            CheckBox current = findViewById(checkBoxIds[i]);
            if(!current.isChecked()){
                continue;
            }
            allergens.addAll(Arrays.asList(checkBoxText[i]));


        }

        TextView otherAllergen = findViewById(R.id.uploadImage_OtherText);
        if(otherAllergen.getText().length() > 0){
            String[] allOther = otherAllergen.getText().toString().split(",");
            allergens.addAll(Arrays.asList(allOther));
        }

        StringBuilder allergensBuilder = new StringBuilder();
        for(String allergen:allergens){
            allergensBuilder.append(allergen);
            allergensBuilder.append(",");
        }
        if(allergensBuilder.length() > 0){
            allergensBuilder.deleteCharAt(allergensBuilder.length()-1);
        }

        JSONObject params = new JSONObject(); //Add allergies as a string array
        try {
            params.put("Menu", base64Image);
            params.put("Allergens", allergensBuilder.toString());
        } catch (JSONException e) {
            Toast.makeText(UploadImage.this, "Failed to put", Toast.LENGTH_SHORT).show();
            e.printStackTrace();
            return;
        }
        JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST,
                "http://192.168.17.118:3000/Allergen",
                params,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                       // Toast.makeText(UploadImage.this, "Boom answer", Toast.LENGTH_SHORT).show();
                        try{
                            String foods = response.getString("EdibleFood");
                            Intent intent = new Intent(UploadImage.this,  MenuItems.class);
                            intent.putExtra(MenuItems.ITEM_EXTRA, foods);
                            startActivity(intent);
                          //  finish();
                        } catch(JSONException e){
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(UploadImage.this, "Error", Toast.LENGTH_SHORT).show();
                        error.printStackTrace();
                    }
                }
        );

        Volley.newRequestQueue(getApplicationContext()).add(request);

    }
}
