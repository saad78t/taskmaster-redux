*** Settings ***
Library    SeleniumLibrary
Suite Teardown  Close Browser


*** Test Cases ***
Test Chrome
    Open Browser    https://saad78t.github.io/taskmaster-redux/cf87a0e3-90c5-4823-9df1-0efc8308cf4f   Chrome  options=add_argument("--headless"); 
    Maximize Browser Window
    Wait Until Element Is Visible    //button[contains(., 'clear')]    timeout=10s
    Element Should Be Enabled    //button[contains(., 'clear')]
    Click Button    //button[contains(., 'clear')]
    Wait Until Element Is Visible    //input[@type='text']    timeout=10s
    Input Text    //input[@type='text']    Test input text

    # إضافة مهمة جديدة للتعديل
    Input Text    //input[@placeholder='enter a notification']    Task to Edit
    Click Button    //button[contains(., 'add')]

    Wait Until Element Is Visible    //button[contains(., 'read more')]    timeout=10s
    Element Should Be Enabled    //button[contains(., 'read more')]
    Click Button    //button[contains(., 'read more')]

    Wait Until Page Contains    Task to Edit    timeout=5s

 # ✅ تعديل المهمة الأولى "Task to Edit"
    Click Button    //div/li/div[3]/button[1] 
    Wait Until Element Is Visible    //div/section[2]/ul/div/li/input   timeout=5s
    Clear Element Text    //div/section[2]/ul/div/li/input
    Input Text    //div/section[2]/ul/div/li/input    Edited Task
    Click Button    //div/section[2]/ul/div/li/button[1]
    Wait Until Page Contains    Edited Task    timeout=5s
    Page Should Not Contain    Task to Edit

    # إضافة مهمة جديدة للحذف
    Input Text    //input[@placeholder='enter a notification']    Delete Me
    Click Button    //button[contains(., 'add')]

    
    Click Button    (//button[contains(., 'read more')])[2]

    # انتظار ظهور النص
    Wait Until Page Contains    Delete Me    timeout=5s

    # تم الحصول على الزر من xpath .النقر على زر الحذف
    Click Button    //div[2]/li/div[3]/button[2]

    # التأكد من اختفاء النص
    Wait Until Page Does Not Contain    Delete Me    timeout=5s
    [Teardown]    Close All Browsers

***comments***
Test Firefox
    Open Browser    https://tasksmaster-e2c96b.gitlab.io    Chrome  options=add_argument("--headless"); 
    Maximize Browser Window
    Wait Until Element Is Visible    //button[contains(., 'clear')]    timeout=10s
    Element Should Be Enabled    //button[contains(., 'clear')]
    Click Button    //button[contains(., 'clear')]
    Wait Until Element Is Visible    //input[@type='text']    timeout=10s
    Input Text    //input[@type='text']    Test input text

    # إضافة مهمة جديدة للتعديل
    Input Text    //input[@placeholder='enter a notification']    Task to Edit
    Click Button    //button[contains(., 'add')]

    Wait Until Element Is Visible    //button[contains(., 'read more')]    timeout=10s
    Element Should Be Enabled    //button[contains(., 'read more')]
    Click Button    //button[contains(., 'read more')]

    Wait Until Page Contains    Task to Edit    timeout=5s

 # ✅ تعديل المهمة الأولى "Task to Edit"
    Click Button    //div/li/div[3]/button[1] 
    Wait Until Element Is Visible    //div/section[2]/ul/div/li/input   timeout=5s
    Clear Element Text    //div/section[2]/ul/div/li/input
    Input Text    //div/section[2]/ul/div/li/input    Edited Task
    Click Button    //div/section[2]/ul/div/li/button[1]
    Wait Until Page Contains    Edited Task    timeout=5s
    Page Should Not Contain    Task to Edit

    # إضافة مهمة جديدة للحذف
    Input Text    //input[@placeholder='enter a notification']    Delete Me
    Click Button    //button[contains(., 'add')]

    
    Click Button    (//button[contains(., 'read more')])[2]

    # انتظار ظهور النص
    Wait Until Page Contains    Delete Me    timeout=5s

    # تم الحصول على الزر من xpath .النقر على زر الحذف
    Click Button    //div[2]/li/div[3]/button[2]

    # التأكد من اختفاء النص
    Wait Until Page Does Not Contain    Delete Me    timeout=5s
    [Teardown]    Close All Browsers

Test Edge
    Open Browser    https://tasksmaster-e2c96b.gitlab.io    Chrome  options=add_argument("--headless"); 
    Maximize Browser Window
    Wait Until Element Is Visible    //button[contains(., 'clear')]    timeout=10s
    Element Should Be Enabled    //button[contains(., 'clear')]
    Click Button    //button[contains(., 'clear')]
    Wait Until Element Is Visible    //input[@type='text']    timeout=10s
    Input Text    //input[@type='text']    Test input text

    # إضافة مهمة جديدة للتعديل
    Input Text    //input[@placeholder='enter a notification']    Task to Edit
    Click Button    //button[contains(., 'add')]

    Wait Until Element Is Visible    //button[contains(., 'read more')]    timeout=10s
    Element Should Be Enabled    //button[contains(., 'read more')]
    Click Button    //button[contains(., 'read more')]

    Wait Until Page Contains    Task to Edit    timeout=5s

 # ✅ تعديل المهمة الأولى "Task to Edit"
    Click Button    //div/li/div[3]/button[1] 
    Wait Until Element Is Visible    //div/section[2]/ul/div/li/input   timeout=5s
    Clear Element Text    //div/section[2]/ul/div/li/input
    Input Text    //div/section[2]/ul/div/li/input    Edited Task
    Click Button    //div/section[2]/ul/div/li/button[1]
    Wait Until Page Contains    Edited Task    timeout=5s
    Page Should Not Contain    Task to Edit

    # إضافة مهمة جديدة للحذف
    Input Text    //input[@placeholder='enter a notification']    Delete Me
    Click Button    //button[contains(., 'add')]

    
    Click Button    (//button[contains(., 'read more')])[2]

    # انتظار ظهور النص
    Wait Until Page Contains    Delete Me    timeout=5s

    # تم الحصول على الزر من xpath .النقر على زر الحذف
    Click Button    //div[2]/li/div[3]/button[2]

    # التأكد من اختفاء النص
    Wait Until Page Does Not Contain    Delete Me    timeout=5s
    [Teardown]    Close All Browsers
