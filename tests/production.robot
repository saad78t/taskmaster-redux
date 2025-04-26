*** Settings ***
Library    SeleniumLibrary
Suite Teardown  Close Browser

*** Variables ***
${URL}             https://saad78t.github.io/taskmaster-redux/

*** Test Cases ***


Test Firefox
    Open Browser    ${URL}    Firefox     options=add_argument("--headless")
    Maximize Browser Window
    Title Should Be  TaskMaster With Redux
    Wait Until Element Is Visible    //button[contains(., "Add Task")]    timeout=10s
    Click Button    //button[contains(., "Add Task")]
    Wait Until Element Is Visible    //input[@type='text']    timeout=10s
    Input Text    //input[@type='text']    Test input text
    
    # Add a new task
    Select From List By Value   //div[1]/div[2]/select  High
    Select From List By Value   //div[1]/div[3]/select  Personal
    Input Text    //input[@placeholder='Enter task name...']    Task to Edit
    Input Text    //input[@placeholder='Enter task description...']    Task to Edit
    Click Button    //button[contains(., "Add Task")]
    Wait Until Element Is Visible    //button[contains(., 'read more')]    timeout=10s
    Element Should Be Enabled    //button[contains(., 'read more')]
    Click Button    //button[contains(., 'read more')]
    Wait Until Page Contains    Task to Edit    timeout=5s

    # Update Task
    Wait Until Element Is Visible    xpath=//button[contains(text(), 'read more')]    timeout=5s
    Element Into View         xpath=//button[contains(text(), 'read more')]
    Click Element    //div[2]/div[1]/div[1]/a/h3
    Wait Until Page Contains    Edit Task
    Input Text      //div/div/div[1]/input     ${empty}     Edited
    Click Button    //button[contains(., 'Update Task')]
    Wait Until Element Is Visible         //button[contains(., 'Update Task')]    timeout=6s
    Click Button    //button[contains(., '🔙 Back to list')]
    [Teardown]    Close All Browsers
***Comments***
Test Edge
    Open Browser    ${URL}     browser=edge    options=add_argument("--no-user-data-dir")
    Maximize Browser Window
    Title Should Be  TaskMaster With Redux
    Wait Until Element Is Visible    //button[contains(., "Add Task")]    timeout=10s
    Click Button    //button[contains(., "Add Task")]
    Wait Until Element Is Visible    //input[@type='text']    timeout=10s
    Input Text    //input[@type='text']    Test input text
    
    # Add a new task
    Select From List By Value   //div[1]/div[2]/select  High
    Select From List By Value   //div[1]/div[3]/select  Personal
    Input Text    //input[@placeholder='Enter task name...']    Task to Edit
    Input Text    //input[@placeholder='Enter task description...']    Task to Edit
    Click Button    //button[contains(., "Add Task")]
    
    Wait Until Element Is Visible    //button[contains(., 'read more')]    timeout=10s
    Element Should Be Enabled    //button[contains(., 'read more')]
    Click Button    //button[contains(., 'read more')]
    Wait Until Page Contains    Task to Edit    timeout=5s

    Click Element    //div[2]/div[1]/div[1]/a/h3
    Wait Until Page Contains    Edit Task
    Input Text      //div/div/div[1]/input     ${empty}    Edited
    Click Button    //button[contains(., 'Update Task')]
    Wait Until Element Is Visible         //button[contains(., 'Update Task')]    timeout=6s
    Click Button    //button[contains(., '🔙 Back to list')]
    [Teardown]    Close All Browsers

    Test Chrome
    Open Browser    ${URL}   Chrome  options=add_argument("--headless"); 
    Maximize Browser Window
    Title Should Be  TaskMaster With Redux
    Wait Until Element Is Visible    //button[contains(., "Add Task")]    timeout=10s
    Click Button    //button[contains(., "Add Task")]
    Wait Until Element Is Visible    //input[@type='text']    timeout=10s
    Input Text    //input[@type='text']    Test input text
    
    # Add a new task
    Select From List By Value   //div[1]/div[2]/select  High
    Select From List By Value   //div[1]/div[3]/select  Personal
    Input Text    //input[@placeholder='Enter task name...']    Task to Edit
    Input Text    //input[@placeholder='Enter task description...']    Task to Edit
    Click Button    //button[contains(., "Add Task")]
    
    Wait Until Element Is Visible    //button[contains(., 'read more')]    timeout=10s
    Element Should Be Enabled    //button[contains(., 'read more')]
    Click Button    //button[contains(., 'read more')]
    Wait Until Page Contains    Task to Edit    timeout=5s

    Click Element    //div[2]/div[1]/div[1]/a/h3
    Wait Until Page Contains    Edit Task
    Input Text      //div/div/div[1]/input     ${empty}     Edited
    Click Button    //button[contains(., 'Update Task')]
    Wait Until Element Is Visible         //button[contains(., 'Update Task')]    timeout=6s
    Click Button    //button[contains(., '🔙 Back to list')]
    [Teardown]    Close All Browsers