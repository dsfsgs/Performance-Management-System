<template>
    <div class="app-container">
        <!-- App Header -->
        <div class="app-header">
            <div class="header-content">
                <div class="text-h6 text-white">CITY OF TAGUM - HUMAN RESOURCE MANAGEMENT OFFICE</div>
            </div>
            <div class="col-auto">
                <q-btn flat round dense text-color="white" icon="close" @click="$emit('close')" />
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="main-content">
            <!-- Fixed Left Navigation -->
            <div class="division-nav">
                <div class="division-nav-header">
                    <div class="text-h6">Employee Details</div>
                </div>
                <q-list padding class="employee-details">
                    <q-item>
                        <q-item-section>
                            <q-item-label caption>Name</q-item-label>
                            <q-item-label>{{ employee?.name || 'N/A' }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section>
                            <q-item-label caption>Position</q-item-label>
                            <q-item-label>{{ employee?.position || 'N/A' }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section>
                            <q-item-label caption>Division</q-item-label>
                            <q-item-label>{{ employee?.division || 'N/A' }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section>
                            <q-item-label caption>Status</q-item-label>
                            <q-item-label>
                                <q-badge :color="getStatusColor(employee?.status)"
                                    :text-color="getStatusTextColor(employee?.status)" align="middle"
                                    class="q-px-md q-py-xs" rounded>
                                    <q-icon :name="getStatusIcon(employee?.status)" class="q-mr-xs" />
                                    {{ employee?.status }}
                                </q-badge>
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-separator class="q-my-md" />
                    <q-item>
                        <q-btn color="positive" label="Approve" class="full-width"
                            :disable="employee?.status === 'Approved'" @click="$emit('approve')" />
                    </q-item>
                </q-list>
            </div>

            <!-- Report Content Area - With Tabs -->
            <div class="report-container">
                <!-- Fixed Report Header -->
                <div class="report-header">
                    <div class="row items-center no-wrap">
                        <div class="col">
                            <div class="text-h6">IPCR Documents</div>
                            <div class="text-subtitle2">Target Period: January - June 2025</div>
                        </div>
                        <div class="flex justify-end q-gutter-sm">
                            <q-btn color="green-9" icon="print" label="Print" @click="printReport"
                                :loading="isPrinting" />
                            <q-btn color="green-9" icon="download" label="Download PDF" @click="downloadPdf"
                                :loading="isGeneratingPdf" />
                            <q-tooltip>Download as PDF</q-tooltip>
                        </div>
                    </div>
                </div>

                <!-- Tabs for different report types -->
                <q-tabs v-model="activeTab" dense class="text-grey" active-color="primary" indicator-color="primary"
                    align="justify" narrow-indicator>
                    <q-tab name="ipcr" label="IPCR" />
                    <q-tab name="ps" label="Performance Standard" />
                    <q-tab name="mpo" label="Monthly Performance Output" />
                    <q-tab name="smpr" label="Summary Monthly Performance Report" />
                </q-tabs>

                <!-- Scrollable Report Content -->
                <div class="report-content-scroll">
                    <q-tab-panels v-model="activeTab" animated>
                        <!-- IPCR Tab -->
                        <q-tab-panel name="ipcr">
                            <div class="report-content" id="print-section">
                                <!-- Header with Logo -->
                                <div class="header">
                                    <img src="https://phshirt.com/wp-content/uploads/2021/11/City-of-Tagum-Logo.png"
                                        alt="City of Tagum Logo" class="logo">
                                    <div class="center-text">
                                        <div class="title">INDIVIDUAL PERFORMANCE COMMITMENT AND REVIEW (IPCR)</div>
                                        <div class="title">CITY OF HUMAN RESOURCE MANAGEMENT OFFICE</div>
                                    </div>
                                    <img src="https://phshirt.com/wp-content/uploads/2021/11/City-of-Tagum-Logo.png"
                                        alt="City of Tagum Logo" class="logo">
                                </div>

                                <div>
                                    <div style="display: flex;">
                                        <!-- Left section (3/4 width) -->
                                        <div style="flex: 3; padding-right: 10px;">
                                            <div>I, <strong><u>{{ employee?.name }}</u></strong>, of <strong><u>{{
                                                employee?.division }}</u></strong>,
                                                commit to deliver and
                                                agree to be rated on the attainment of the following targets in
                                                accordance
                                                with the indicated measure for the period January - June 2025.
                                            </div>
                                            <div style="display: flex; justify-content: flex-end; padding-right: 80px;">
                                                <div style="padding-bottom: 10px; text-align: center;">
                                                    <div style="padding-top: 30px;"><strong><u>{{ employee?.name
                                                                }}</u></strong></div>
                                                    <div>{{ employee?.position }}</div>
                                                    <div>Date:<strong><u>01/21/2025</u></strong></div>
                                                </div>
                                            </div>
                                            <div>
                                                <table
                                                    style="width: 100%; border-collapse: collapse; border: 1px solid black;">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                style="border: 1px solid black; padding: 8px; text-align: left;">
                                                                Reviewed by:</th>
                                                            <th
                                                                style="border: 1px solid black; padding: 8px; text-align: left;">
                                                                Approved by:</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td
                                                                style="border: 1px solid black; padding-top: 30px; text-align: center;">
                                                                <div><strong><u>{{ employee?.name }}</u></strong></div>
                                                                <div>{{ employee?.position }}</div>
                                                                <div>Date:<u>01/21/2025</u></div>
                                                            </td>
                                                            <td
                                                                style="border: 1px solid black; padding-top: 30px; text-align: center;">
                                                                <div><strong><u>{{ employee?.name }}</u></strong></div>
                                                                <div>{{ employee?.position }}</div>
                                                                <div>Date:<u>01/21/2025</u></div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <!-- Right section (1/4 width) -->
                                        <div
                                            style="flex: 1; align-items: flex-end; display: flex; flex-direction: column; gap: 30px;">
                                            <!-- First Stamp -->
                                            <div
                                                style="border: 3px double navy; text-align: center; color: navy; width: 250px;">
                                                <div style="font-size: 13px;">LOCAL GOVERNMENT OF
                                                    TAGUM CITY</div>
                                                <div style="font-size: 13px;">{{
                                                    employee?.division }}</div>
                                                <div style="font-size: 13px;">
                                                    IPCR Accomplishment
                                                </div>
                                                <div>RECEIVED</div>
                                                <div style="text-align: left; padding-left: 10px;">
                                                    By: <span
                                                        style="border-bottom: 1px solid #000; display: inline-block; width: 190px;"></span>
                                                </div>
                                                <div style="text-align: left; padding-left: 10px;">
                                                    Date & Time: <span
                                                        style="border-bottom: 1px solid #000; display: inline-block; width: 120px;"></span>
                                                </div>
                                            </div>

                                            <div
                                                style="border: 3px double navy; text-align: center; color: navy; width: 250px;">
                                                <div style="font-size: 13px;">LOCAL GOVERNMENT OF
                                                    TAGUM CITY</div>
                                                <div style="font-size: 13px;">{{
                                                    employee?.division }}</div>
                                                <div style="font-size: 13px;">
                                                    IPCR Accomplishment
                                                </div>
                                                <div>RECEIVED</div>
                                                <div style="text-align: left; padding-left: 10px;">
                                                    By: <span
                                                        style="border-bottom: 1px solid #000; display: inline-block; width: 190px;"></span>
                                                </div>
                                                <div style="text-align: left; padding-left: 10px;">
                                                    Date & Time: <span
                                                        style="border-bottom: 1px solid #000; display: inline-block; width: 120px;"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style="display: flex; gap: 20px; align-items: flex-start; margin-top: 20px;">
                                    <!-- Stamp Box -->
                                    <div
                                        style="border: 3px double navy; text-align: center; color: navy; width: 300px; padding: 10px;">
                                        <div style="font-size: 13px; font-weight: bold;">Performance Management Team
                                        </div>
                                        <div
                                            style="text-align: left; padding-left: 10px; font-size:10px; margin-top: 15px;">
                                            Target Calibrated by: <span
                                                style="border-bottom: 1px solid #000; display: inline-block; width: 150px;"></span>
                                        </div>
                                        <div
                                            style="text-align: left; padding-left: 10px; font-size:10px; margin-top: 10px;">
                                            Date: <span
                                                style="border-bottom: 1px solid #000; display: inline-block; width: 230px;"></span>
                                        </div>
                                    </div>

                                    <!-- Rating Table -->
                                    <table style="border-collapse: collapse; border: 1px solid black; width: 250px;">
                                        <tbody>
                                            <tr>
                                                <td
                                                    style="border: 1px solid black; text-align: center; width: 30px; padding: 5px; font-size: 10px;">
                                                    5</td>
                                                <td
                                                    style="border: 1px solid black; padding: 5px 10px; font-size: 10px;">
                                                    Outstanding</td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="border: 1px solid black; text-align: center; padding: 5px; font-size: 10px;">
                                                    4
                                                </td>
                                                <td
                                                    style="border: 1px solid black; padding: 5px 10px; font-size: 10px;">
                                                    Very
                                                    Satisfactory</td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="border: 1px solid black; text-align: center; padding: 5px; font-size: 10px;">
                                                    3
                                                </td>
                                                <td
                                                    style="border: 1px solid black; padding: 5px 10px; font-size: 10px;">
                                                    Satisfactory
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="border: 1px solid black; text-align: center; padding: 5px; font-size: 10px;">
                                                    2
                                                </td>
                                                <td
                                                    style="border: 1px solid black; padding: 5px 10px; font-size: 10px;">
                                                    Unsatisfactory
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="border: 1px solid black; text-align: center; padding: 5px; font-size: 10px;">
                                                    1
                                                </td>
                                                <td
                                                    style="border: 1px solid black; padding: 5px 10px; font-size: 10px;">
                                                    Poor</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div class="q-mt-md">
                                    <!-- Main Table -->
                                    <div class="table-container">
                                        <table class="full-width main-table">
                                            <thead class="no-repeat-header">
                                                <tr>
                                                    <th rowspan="2" class="text-center mfo-column">MAJOR FINAL OUTPUT
                                                    </th>
                                                    <th rowspan="2" class="text-center mfo-column">SUCCESS INDICATOR
                                                    </th>
                                                    <th rowspan="2" class="text-center mfo-column">ACTUAL ACCOMPLISHMENT
                                                    </th>
                                                    <th colspan="4" class="text-center">RATING</th>
                                                    <th rowspan="2" class="text-center">REMARKS</th>
                                                </tr>
                                                <tr>
                                                    <th class="text-center">Q (Quality)</th>
                                                    <th class="text-center">E (Efficiency)</th>
                                                    <th class="text-center">T (Timeliness)</th>
                                                    <th class="text-center">A (Average)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Strategic Functions -->
                                                <tr>
                                                    <td colspan="8" class="section-header">STRATEGIC FUNCTION</td>
                                                </tr>
                                                <tr>
                                                    <td>Strategic Plan Implementation</td>
                                                    <td>Strategic Plan Implementation</td>
                                                    <td>Strategic Plan Implementation</td>
                                                    <td class="text-center">{{ employee?.strategic }}</td>
                                                    <td class="text-center">{{ employee?.strategic }}</td>
                                                    <td class="text-center">{{ employee?.strategic }}</td>
                                                    <td class="text-center">{{ employee?.strategic }}</td>
                                                    <td>Implements strategic initiatives on schedule</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="6" class="text-right text-weight-bold">Strategic
                                                        Functions Average Rating</td>
                                                    <td class="text-center text-weight-bold">{{
                                                        employee?.rating }}</td>
                                                    <td></td>
                                                </tr>

                                                <!-- Core Functions -->
                                                <tr>
                                                    <td colspan="8" class="section-header">CORE FUNCTION</td>
                                                </tr>
                                                <tr>
                                                    <td>Recruitment and Selection</td>
                                                    <td>Recruitment and Selection</td>
                                                    <td>Recruitment and Selection</td>
                                                    <td class="text-center">{{ employee?.core }}</td>
                                                    <td class="text-center">{{ employee?.core }}</td>
                                                    <td class="text-center">{{ employee?.core }}</td>
                                                    <td class="text-center">{{ employee?.core }}</td>
                                                    <td>Processes recruitment documents efficiently</td>
                                                </tr>
                                                <tr>
                                                    <td>Employee Development</td>
                                                    <td>Employee Development</td>
                                                    <td>Employee Development</td>
                                                    <td class="text-center">{{ employee?.core }}</td>
                                                    <td class="text-center">{{ employee?.core }}</td>
                                                    <td class="text-center">{{ employee?.core }}</td>
                                                    <td class="text-center">{{ employee?.core }}</td>
                                                    <td>Implements training programs effectively</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="6" class="text-right text-weight-bold">Core
                                                        Functions Average Rating</td>
                                                    <td class="text-center text-weight-bold">4</td>
                                                    <td></td>
                                                </tr>

                                                <!-- Support Functions -->
                                                <tr>
                                                    <td colspan="8" class="section-header">SUPPORT FUNCTION</td>
                                                </tr>
                                                <tr>
                                                    <td>Administrative Support</td>
                                                    <td>Administrative Support</td>
                                                    <td>Administrative Support</td>
                                                    <td class="text-center">{{ employee?.support }}</td>
                                                    <td class="text-center">{{ employee?.support }}</td>
                                                    <td class="text-center">{{ employee?.support }}</td>
                                                    <td class="text-center">{{ employee?.support }}</td>
                                                    <td>Provides timely administrative support</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="6" class="text-right text-weight-bold">Support
                                                        Functions Average
                                                        Rating</td>
                                                    <td class="text-center text-weight-bold">{{
                                                        employee?.rating }}</td>
                                                    <td></td>
                                                </tr>

                                                <!-- Final Rating -->
                                                <tr>
                                                    <td colspan="6" class="text-right text-weight-bold">Final Average
                                                        Rating
                                                    </td>
                                                    <td class="text-center text-weight-bold">8</td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td>Core Function</td>
                                                    <td colspan="4">3.50 = ((4 + 4.33 + 4.66 + 4.33 +4.66 + 4.33 + 5
                                                        +3.66) / 8) *
                                                        0.8</td>
                                                    <td rowspan="4" colspan="3">
                                                        <div
                                                            style="border: 3px double navy; text-align: center; color: navy; width: 300px; padding: 10px;">
                                                            <div style="font-size: 13px; font-weight: bold;">Performance
                                                                Management Team
                                                            </div>
                                                            <div
                                                                style="text-align: left; padding-left: 10px; font-size:10px; margin-top: 15px;">
                                                                Target Calibrated by: <span
                                                                    style="border-bottom: 1px solid #000; display: inline-block; width: 150px;"></span>
                                                            </div>
                                                            <div
                                                                style="text-align: left; padding-left: 10px; font-size:10px; margin-top: 10px;">
                                                                Date: <span
                                                                    style="border-bottom: 1px solid #000; display: inline-block; width: 230px;"></span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Support Function</td>
                                                    <td colspan="4">3.50 = ((4 + 4.33 + 4.66 + 4.33 +4.66 + 4.33 + 5
                                                        +3.66) / 8) *
                                                        0.8</td>
                                                </tr>
                                                <tr>
                                                    <td>Total</td>
                                                    <td colspan="4">4.22</td>
                                                </tr>
                                                <tr>
                                                    <td>ADJECTIVAL RATING
                                                    </td>
                                                    <td colspan="4">4 = VERY SATISFACTORY</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>

                                    <!-- Signature Section -->
                                    <div class="q-mt-xl row">
                                        <div class="col-6">
                                            <div class="text-center">Rated by:</div>
                                            <div class="text-center q-mt-lg">
                                                <div class="text-weight-bold">JANYLENE A. PALERMO, MM</div>
                                                <div>City Human Resource Management Officer</div>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="text-center">Approved by:</div>
                                            <div class="text-center q-mt-lg">
                                                <div class="text-weight-bold">HON. REY T. UY</div>
                                                <div>City Mayor</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </q-tab-panel>

                        <!-- Performance Standard Tab -->
                        <q-tab-panel name="ps">
                            <div class="report-content">
                                <!-- Header with Logo -->
                                <div class="header-container">
                                    <div class="green-line">
                                        <div class="line"></div>
                                    </div>
                                    <div class="city-logo">
                                        <img class="logo" alt="City of Tagum Logo"
                                            src="https://phshirt.com/wp-content/uploads/2021/11/City-of-Tagum-Logo.png" />
                                    </div>
                                    <div class="header-text">
                                        <div class="text-green-9 text-caption padded-text">REPUBLIC OF THE PHILIPPINES
                                        </div>
                                        <div class="text-green-9 text-caption padded-text">PROVINCE OF DAVAO DEL NORTE
                                        </div>
                                        <div class="text-green-9 text-h5 text-weight-bold padded-text">CITY OF TAGUM
                                        </div>

                                        <div class="green-banner">
                                            <div class="padded-text">PERFORMANCE STANDARD</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Main Content -->
                                <div class="q-mt-md">
                                    <table class="full-width info-table">
                                        <tbody>
                                            <tr>
                                                <td><strong>Employee:</strong> {{ employee?.name }}</td>
                                                <td><strong>Rating Period:</strong> January - June 2025</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Position:</strong> {{ employee?.position }}</td>
                                                <td><strong>Division:</strong> {{ employee?.division }}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <!-- Main Table -->
                                    <div class="table-container">
                                        <table class="full-width main-table">
                                            <thead class="no-repeat-header">
                                                <tr>
                                                    <th rowspan="2" class="text-center">MAJOR FINAL OUTPUT</th>
                                                    <th colspan="5" class="text-center">PERFORMANCE STANDARDS</th>
                                                </tr>
                                                <tr>
                                                    <th class="text-center">5 - Outstanding</th>
                                                    <th class="text-center">4 - Very Satisfactory</th>
                                                    <th class="text-center">3 - Satisfactory</th>
                                                    <th class="text-center">2 - Unsatisfactory</th>
                                                    <th class="text-center">1 - Poor</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Strategic Functions -->
                                                <tr>
                                                    <td colspan="6" class="section-header">STRATEGIC FUNCTION (20%)</td>
                                                </tr>
                                                <tr>
                                                    <td>Strategic Plan Implementation</td>
                                                    <td>Q - 100% completion<br>E - Excellent quality<br>T - Ahead of
                                                        schedule</td>
                                                    <td>Q - 90-99% completion<br>E - Good quality<br>T - On schedule
                                                    </td>
                                                    <td>Q - 80-89% completion<br>E - Acceptable quality<br>T - Minimal
                                                        delay</td>
                                                    <td>Q - 70-79% completion<br>E - Needs improvement<br>T - With
                                                        delays</td>
                                                    <td>Q - Below 70% completion<br>E - Poor quality<br>T - Significant
                                                        delays</td>
                                                </tr>

                                                <!-- Core Functions -->
                                                <tr>
                                                    <td colspan="6" class="section-header">CORE FUNCTION (60%)</td>
                                                </tr>
                                                <tr>
                                                    <td>Recruitment and Selection</td>
                                                    <td>Q - 100% compliance<br>E - 0 errors<br>T - 1 day</td>
                                                    <td>Q - 95-99% compliance<br>E - 1-2 errors<br>T - 2 days</td>
                                                    <td>Q - 90-94% compliance<br>E - 3-4 errors<br>T - 3 days</td>
                                                    <td>Q - 85-89% compliance<br>E - 5-6 errors<br>T - 4 days</td>
                                                    <td>Q - Below 85% compliance<br>E - 7+ errors<br>T - 5+ days</td>
                                                </tr>
                                                <tr>
                                                    <td>Employee Development</td>
                                                    <td>Q - 100% completion<br>E - Excellent feedback<br>T - Ahead of
                                                        schedule</td>
                                                    <td>Q - 90-99% completion<br>E - Very good feedback<br>T - On
                                                        schedule</td>
                                                    <td>Q - 80-89% completion<br>E - Good feedback<br>T - Minimal delay
                                                    </td>
                                                    <td>Q - 70-79% completion<br>E - Average feedback<br>T - With delay
                                                    </td>
                                                    <td>Q - Below 70% completion<br>E - Poor feedback<br>T - Significant
                                                        delay</td>
                                                </tr>

                                                <!-- Support Functions -->
                                                <tr>
                                                    <td colspan="6" class="section-header">SUPPORT FUNCTION (20%)</td>
                                                </tr>
                                                <tr>
                                                    <td>Administrative Support</td>
                                                    <td>Q - 100% completion<br>E - 0 errors<br>T - Same day</td>
                                                    <td>Q - 95-99% completion<br>E - 1-2 errors<br>T - Next day</td>
                                                    <td>Q - 90-94% completion<br>E - 3-4 errors<br>T - 2 days</td>
                                                    <td>Q - 85-89% completion<br>E - 5-6 errors<br>T - 3 days</td>
                                                    <td>Q - Below 85% completion<br>E - 7+ errors<br>T - 4+ days</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </q-tab-panel>

                        <!-- Monthly Performance Output Tab -->
                        <q-tab-panel name="mpo">
                            <div class="report-content">
                                <!-- Header with Logo -->
                                <div class="header-container">
                                    <div class="green-line">
                                        <div class="line"></div>
                                    </div>
                                    <div class="city-logo">
                                        <img class="logo" alt="City of Tagum Logo"
                                            src="https://phshirt.com/wp-content/uploads/2021/11/City-of-Tagum-Logo.png" />
                                    </div>
                                    <div class="header-text">
                                        <div class="text-green-9 text-caption padded-text">REPUBLIC OF THE PHILIPPINES
                                        </div>
                                        <div class="text-green-9 text-caption padded-text">PROVINCE OF DAVAO DEL NORTE
                                        </div>
                                        <div class="text-green-9 text-h5 text-weight-bold padded-text">CITY OF TAGUM
                                        </div>

                                        <div class="green-banner">
                                            <div class="padded-text">MONTHLY PERFORMANCE OUTPUT</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Main Content -->
                                <div class="q-mt-md">
                                    <table class="full-width info-table">
                                        <tbody>
                                            <tr>
                                                <td><strong>Employee:</strong> {{ employee?.name }}</td>
                                                <td><strong>Month:</strong> January 2025</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Position:</strong> {{ employee?.position }}</td>
                                                <td><strong>Division:</strong> {{ employee?.division }}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <!-- Main Table -->
                                    <div class="table-container">
                                        <table class="full-width main-table">
                                            <thead class="no-repeat-header">
                                                <tr>
                                                    <th class="text-center">MAJOR FINAL OUTPUT</th>
                                                    <th class="text-center">TARGET FOR THE MONTH</th>
                                                    <th class="text-center">ACTUAL ACCOMPLISHMENT</th>
                                                    <th class="text-center">% ACCOMPLISHMENT</th>
                                                    <th class="text-center">REMARKS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- Strategic Functions -->
                                                <tr>
                                                    <td colspan="5" class="section-header">STRATEGIC FUNCTION</td>
                                                </tr>
                                                <tr>
                                                    <td>Strategic Plan Implementation</td>
                                                    <td>Conduct 2 strategic planning sessions</td>
                                                    <td>Conducted 2 strategic planning sessions</td>
                                                    <td class="text-center">100%</td>
                                                    <td>Completed as scheduled</td>
                                                </tr>

                                                <!-- Core Functions -->
                                                <tr>
                                                    <td colspan="5" class="section-header">CORE FUNCTION</td>
                                                </tr>
                                                <tr>
                                                    <td>Recruitment and Selection</td>
                                                    <td>Process 50 job applications</td>
                                                    <td>Processed 54 job applications</td>
                                                    <td class="text-center">108%</td>
                                                    <td>Exceeded target</td>
                                                </tr>
                                                <tr>
                                                    <td>Employee Development</td>
                                                    <td>Conduct 2 training programs</td>
                                                    <td>Conducted 2 training programs</td>
                                                    <td class="text-center">100%</td>
                                                    <td>Completed as scheduled</td>
                                                </tr>

                                                <!-- Support Functions -->
                                                <tr>
                                                    <td colspan="5" class="section-header">SUPPORT FUNCTION</td>
                                                </tr>
                                                <tr>
                                                    <td>Administrative Support</td>
                                                    <td>Process 100 administrative documents</td>
                                                    <td>Processed 105 administrative documents</td>
                                                    <td class="text-center">105%</td>
                                                    <td>Exceeded target</td>
                                                </tr>

                                                <!-- Summary -->
                                                <tr>
                                                    <td colspan="3" class="text-right text-weight-bold">AVERAGE %
                                                        ACCOMPLISHMENT:</td>
                                                    <td class="text-center text-weight-bold">103%</td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <!-- Signature Section -->
                                    <div class="q-mt-xl row">
                                        <div class="col-6">
                                            <div class="text-center">Prepared by:</div>
                                            <div class="text-center q-mt-lg">
                                                <div class="text-weight-bold">{{ employee?.name }}</div>
                                                <div>{{ employee?.position }}</div>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="text-center">Verified by:</div>
                                            <div class="text-center q-mt-lg">
                                                <div class="text-weight-bold">JANYLENE A. PALERMO, MM</div>
                                                <div>City Human Resource Management Officer</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </q-tab-panel>

                        <!-- Summary Monthly Performance Report Tab -->
                        <q-tab-panel name="smpr">
                            <div class="report-content">
                                <!-- Header with Logo -->
                                <div class="header-container">
                                    <div class="green-line">
                                        <div class="line"></div>
                                    </div>
                                    <div class="city-logo">
                                        <img class="logo" alt="City of Tagum Logo"
                                            src="https://phshirt.com/wp-content/uploads/2021/11/City-of-Tagum-Logo.png" />
                                    </div>
                                    <div class="header-text">
                                        <div class="text-green-9 text-caption padded-text">REPUBLIC OF THE PHILIPPINES
                                        </div>
                                        <div class="text-green-9 text-caption padded-text">PROVINCE OF DAVAO DEL NORTE
                                        </div>
                                        <div class="text-green-9 text-h5 text-weight-bold padded-text">CITY OF TAGUM
                                        </div>

                                        <div class="green-banner">
                                            <div class="padded-text">SUMMARY MONTHLY PERFORMANCE REPORT</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Main Content -->
                                <div class="q-mt-md">
                                    <table class="full-width info-table">
                                        <tbody>
                                            <tr>
                                                <td><strong>Employee:</strong> {{ employee?.name }}</td>
                                                <td><strong>Period:</strong> January - June 2025</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Position:</strong> {{ employee?.position }}</td>
                                                <td><strong>Division:</strong> {{ employee?.division }}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <!-- Main Table -->
                                    <div class="table-container">
                                        <table class="full-width main-table">
                                            <thead class="no-repeat-header">
                                                <tr>
                                                    <th rowspan="2" class="text-center">MONTH</th>
                                                    <th colspan="3" class="text-center">AVERAGE ACCOMPLISHMENT PER
                                                        FUNCTION</th>
                                                    <th rowspan="2" class="text-center">OVERALL RATING</th>
                                                    <th rowspan="2" class="text-center">REMARKS</th>
                                                </tr>
                                                <tr>
                                                    <th class="text-center">Strategic (20%)</th>
                                                    <th class="text-center">Core (60%)</th>
                                                    <th class="text-center">Support (20%)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>January</td>
                                                    <td class="text-center">100%</td>
                                                    <td class="text-center">105%</td>
                                                    <td class="text-center">105%</td>
                                                    <td class="text-center">104%</td>
                                                    <td>Exceeded targets</td>
                                                </tr>
                                                <tr>
                                                    <td>February</td>
                                                    <td class="text-center">100%</td>
                                                    <td class="text-center">102%</td>
                                                    <td class="text-center">100%</td>
                                                    <td class="text-center">101%</td>
                                                    <td>Met targets</td>
                                                </tr>
                                                <tr>
                                                    <td>March</td>
                                                    <td class="text-center">95%</td>
                                                    <td class="text-center">100%</td>
                                                    <td class="text-center">102%</td>
                                                    <td class="text-center">99%</td>
                                                    <td>Met targets</td>
                                                </tr>
                                                <tr>
                                                    <td>April</td>
                                                    <td class="text-center">105%</td>
                                                    <td class="text-center">103%</td>
                                                    <td class="text-center">100%</td>
                                                    <td class="text-center">103%</td>
                                                    <td>Exceeded targets</td>
                                                </tr>
                                                <tr>
                                                    <td>May</td>
                                                    <td class="text-center">100%</td>
                                                    <td class="text-center">100%</td>
                                                    <td class="text-center">105%</td>
                                                    <td class="text-center">101%</td>
                                                    <td>Met targets</td>
                                                </tr>
                                                <tr>
                                                    <td>June</td>
                                                    <td class="text-center">102%</td>
                                                    <td class="text-center">104%</td>
                                                    <td class="text-center">100%</td>
                                                    <td class="text-center">103%</td>
                                                    <td>Exceeded targets</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-weight-bold">Semi-Annual Average</td>
                                                    <td class="text-center text-weight-bold">100%</td>
                                                    <td class="text-center text-weight-bold">102%</td>
                                                    <td class="text-center text-weight-bold">102%</td>
                                                    <td class="text-center text-weight-bold">102%</td>
                                                    <td class="text-weight-bold">Very Satisfactory</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <!-- Signature Section -->
                                    <div class="q-mt-xl row">
                                        <div class="col-6">
                                            <div class="text-center">Prepared by:</div>
                                            <div class="text-center q-mt-lg">
                                                <div class="text-weight-bold">REIL R. IGONA, MM, CHRA</div>
                                                <div>Acting SAO / HRMO III</div>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="text-center">Approved by:</div>
                                            <div class="text-center q-mt-lg">
                                                <div class="text-weight-bold">JANYLENE A. PALERMO, MM</div>
                                                <div>City Human Resource Management Officer</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </q-tab-panel>
                    </q-tab-panels>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const props = defineProps({
    employee: {
        type: Object,
        required: true
    }
});

defineEmits(['close', 'approve']);

// Active tab state
const activeTab = ref('ipcr');
const isPrinting = ref(false);
const isGeneratingPdf = ref(false);

// Status style helpers
const getStatusColor = (status) => {
    switch (status) {
        case 'Approved': return 'positive';
        case 'Incomplete': return 'orange';
        case 'Not Reviewed': return 'grey-6';
        default: return 'grey';
    }
};

const getStatusTextColor = (status) => {
    return status === 'Not Reviewed' ? 'white' : 'white';
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'Approved': return 'check_circle';
        case 'Incomplete': return 'error_outline';
        case 'Not Reviewed': return 'hourglass_empty';
        default: return 'help_outline';
    }
};

// Print report
const printReport = () => {
    isPrinting.value = true;

    // Create a hidden iframe with proper styling for printing
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';

    document.body.appendChild(printFrame);

    printFrame.onload = () => {
        const printDocument = printFrame.contentWindow.document;
        const printSection = document.getElementById('print-section');

        // Copy the CSS
        const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
        styles.forEach(style => {
            printDocument.head.appendChild(style.cloneNode(true));
        });

        // Add print-specific stylesheet
        const printStyle = document.createElement('style');
        printStyle.textContent = `
      @page {
        size: legal landscape;
        margin: 10mm;
      }
      body { 
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
      }
      .logo {
        width: 120px;
        height: auto;
      }
      .main-table {
        table-layout: fixed;
        width: 100%;
      }
      .main-table tr {
        page-break-inside: avoid; /* Prevent rows from breaking across pages */
      }
      /* Force headers to NOT repeat */
      .no-repeat-header {
        display: table-header-group !important;
        break-inside: avoid !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
      }
      /* Ensure tables don't break awkwardly */
      .table-container {
        page-break-inside: avoid;
      }
      /* Signature section handling */
      .signature-section {
        page-break-inside: avoid;
        margin-top: 50px;
      }
    `;
        printDocument.head.appendChild(printStyle);

        // Clone and modify the content for printing
        const content = printSection.cloneNode(true);

        // Remove buttons and other non-print elements
        const buttons = content.querySelectorAll('button, .q-tabs, .q-tab-panels');
        buttons.forEach(button => button.remove());

        // Add the content to the iframe
        printDocument.body.appendChild(content);

        // Print after a short delay to ensure content is loaded
        setTimeout(() => {
            printFrame.contentWindow.focus();
            printFrame.contentWindow.print();
            document.body.removeChild(printFrame);
            isPrinting.value = false;
        }, 500);
    };

    printFrame.src = 'about:blank';
};

// Download as PDF
const downloadPdf = async () => {
    isGeneratingPdf.value = true;

    try {
        const element = document.getElementById('print-section');
        const canvas = await html2canvas(element, {
            scale: 2, // Higher quality
            logging: false,
            useCORS: true,
            allowTaint: true
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'legal'
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${props.employee.name.replace(' ', '_')}_IPCR_Report.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
    } finally {
        isGeneratingPdf.value = false;
    }
};
</script>

<style scoped>
.app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    overflow: hidden;
}

.app-header {
    background-color: #00703C;
    ;
    color: white;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-content {
    flex-grow: 1;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.logo {
    width: 100px;
    height: auto;
    padding: 10px;
}

.center-text {
    text-align: center;
    flex-grow: 1;
    font-weight: bold;
    line-height: 1.5;
}

.title {
    font-size: 16px;
    margin-bottom: 5px;
}

.main-content {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.division-nav {
    width: 300px;
    background-color: #f5f5f5;
    border-right: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.division-nav-header {
    padding: 16px;
    border-bottom: 1px solid #e0e0e0;
}

.employee-details {
    padding: 16px;
}

.report-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #ebebeb;
}

.report-header {
    padding: 16px;
    border-bottom: 1px solid #e0e0e0;
    background-color: #fafafa;
}

.report-content-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
}

.report-content {
    background-color: white;
    padding: 20px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.header-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}

.green-line {
    width: 100%;
    height: 5px;
    background-color: #2e7d32;
    margin-bottom: 10px;
}

.city-logo {
    margin-bottom: 10px;
}

.header-text {
    text-align: center;
    margin-bottom: 20px;
}

.green-banner {
    background-color: #2e7d32;
    color: white;
    padding: 5px 0;
    margin-top: 10px;
}

.padded-text {
    padding: 2px 0;
}

.info-table {
    margin-bottom: 20px;
    border-collapse: collapse;
}

.info-table td {
    padding: 5px 10px;
    border: none;
}

.table-container {
    margin-top: 20px;
    overflow-x: auto;
}

.main-table {
    border-collapse: collapse;
    width: 100%;
}

.main-table th,
.main-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.main-table th {
    background-color: #f2f2f2;
    text-align: center;
}

.section-header {
    background-color: #e8f5e9;
    font-weight: bold;
    text-align: center;
    padding: 8px;
}

.mfo-column {
    width: 40%;
}

@media print {
    body * {
        visibility: hidden;
    }

    #print-section,
    #print-section * {
        visibility: visible;
    }

    #print-section {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        padding: 0;
    }

    .no-print {
        display: none !important;
    }
}
</style>