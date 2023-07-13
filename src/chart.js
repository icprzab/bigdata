import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FadeLoader } from 'react-spinners';
import styles from './index.module.css';
import icon from './assets/icon.png';
import brand from './assets/brand.png';
import cross from './assets/cross.png';
import arrow from './assets/arrow.png';
import { YearContext, CityContext, DistrictContext, LoadingContext } from './app';

function Chart() {
    const navigate = useNavigate();
    const [year, setYear] = useContext(YearContext);
    const [city, setCity] = useContext(CityContext);
    const [district, setDistrict] = useContext(DistrictContext);
    const [loading, setLoading] = useContext(LoadingContext);
    const [submitted, setSubmitted] = useState(false);
    const [chartWidth, setChartWidth] = useState('750');
    const [male, setMale] = useState('');
    const [female, setFemale] = useState('');
    const [ordinary, setOrdinary] = useState('');
    const [single, setSingle] = useState('');
    const option1 = {
        chart: {
            type: 'column',
            width: chartWidth,
            backgroundColor: 'transparent',
        },
        title: {
            text: '人口數統計',
            align: 'center',
        },
        subtitle: {
            text:
                '數量',
            align: 'left',
            style: {
                fontSize: '15px',
                color: 'black',
                fontWeight: '700',
            },
        },
        credits: {
            style: {
                opacity: 0,
            },
            position: {
                align: 'left',
                verticalAlign: 'bottom',
                x: 10,
                y: -10,
            },
        },
        xAxis: {
            categories: ['共同生活', '獨立生活'],
            crosshair: true,
            accessibility: {
                description: 'household',
            },
            lineWidth: 0.01,
            lineColor: 'black',
            title: {
                text: '型態',
                style: {
                    fontSize: '15px',
                    color: 'black',
                    fontWeight: '700',
                },
            },
        },
        colors: ['#7D5FB2', '#C29FFF', '#7D5FB2', '#C29FFF'],
        yAxis: {
            min: 0,
            title: {
                text: '',
            },
        },
        tooltip: {
            valueSuffix: '人',
        },

        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{y}',
                },
            },
            column: {
                borderRadius: '0',
            },
        },
        series: [
            {
                name: '男性',
                data: male,
            },
            {
                name: '女性',
                data: female,
            },
        ],
    };

    const option2 = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            width: chartWidth,
            backgroundColor: 'transparent',
        },
        title: {
            text: '戶數統計',
            align: 'center',
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        },
        accessibility: {
            point: {
                valueSuffix: '%',
            },
        },
        credits: {
            style: {
                opacity: 0,
            },
            position: {
                align: 'left',
                verticalAlign: 'bottom',
                x: 10,
                y: -10,
            },
        },
        colors: ['#626EB2', '#A3B1FF'],
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.percentage:.2f} %',
                    connectorColor: 'silver',
                },
                showInLegend: true,
                borderRadius: '0',
            },
        },
        series: [{
            name: 'Share',
            data: [
                { name: '共同生活', y: parseInt(ordinary) },
                { name: '獨立生活', y: parseInt(single) },
            ],
        }],
    };

    function years(e) {
        navigate('/');
        setCity('');
        setDistrict('');
        setYear(e.target.value);
    }

    function cities(e) {
        navigate('/');
        setYear('111');
        setCity('');
        setDistrict('');
        setCity(e.target.value);
    }

    function districts(e) {
        navigate('/');
        setYear('111');
        setCity('');
        setDistrict('');
        setDistrict(e.target.value);
    }
    function deleted() {
        navigate('/');
        setCity('');
        setDistrict('');
        setSubmitted(false);
    }

    function fetchData() {
        if (year !== '' && city !== '' && district !== '') {
            fetch(`https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019/${year}`, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((data) => {
                    setLoading(false);
                    const household = [];
                    const resData = data.responseData;
                    const res = resData.filter((e) => e.site_id === city + district);
                    household.push(...res);
                    let ordinaryM = 0;
                    let ordinaryF = 0;
                    let singleM = 0;
                    let singleF = 0;
                    let ordinaryTotal = 0;
                    let singleTotal = 0;
                    household.forEach(e => {
                        ordinaryM = ordinaryM += parseInt(e.household_ordinary_m);
                        ordinaryF = ordinaryF += parseInt(e.household_ordinary_f);
                        singleM = singleM += parseInt(e.household_single_m);
                        singleF = singleF += parseInt(e.household_single_f);
                        ordinaryTotal = ordinaryTotal += parseInt(e.household_ordinary_total);
                        singleTotal = singleTotal += parseInt(e.household_single_total);
                    });
                    setSubmitted(true);
                    setMale([ordinaryM, singleM]);
                    setFemale([ordinaryF, singleF]);
                    setOrdinary(ordinaryTotal);
                    setSingle(singleTotal);
                });
        }
    }
    useEffect(() => {
        fetchData();
        if (window.innerWidth >= 960) {
            setChartWidth('700');
        }
        if (window.innerWidth > 550 && window.innerWidth < 960) {
            setChartWidth('450');
        }
        if (window.innerWidth <= 550) {
            setChartWidth('350');
        }
    }, [window.innerWidth]);

    return (
        <div className={styles.content}>
            <div className={styles.head}>
                <div className={styles.head_LOGO}>LOGO</div>
                <div className={styles.head_img}><img src={icon} alt="icon" /></div>
            </div>
            <div className={styles.under}>
                <img src={brand} alt="brand" />
                <div className={styles.under_right}>
                    <div className={styles.under_right_text}>人口數、戶數按戶別及性別統計</div>
                    <div className={styles.under_right_bottom}>
                        <div className={styles.under_right_year}>
                            <div className={styles.under_right_year_text}>年份</div>
                            <div className={styles.under_right_year_arrow}>
                                <img src={arrow} alt="arrow" />
                            </div>
                            <select className={styles.under_right_year_select} value={year} onChange={years}>
                                <option value="111">111</option>
                                <option value="110">110</option>
                                <option value="109">109</option>
                                <option value="108">108</option>
                                <option value="107">107</option>
                                <option value="106">106</option>
                            </select>
                        </div>
                        <div className={styles.under_right_city}>
                            <div className={styles.under_right_city_text}>縣/市</div>
                            <button type="button" className={city !== '' ? styles.under_right_city_cross : styles.under_right_city_invisible} onClick={deleted}>
                                <img src={cross} alt="cross" />
                            </button>
                            <div className={styles.under_right_city_arrow}>
                                <img src={arrow} alt="arrow" />
                            </div>
                            <select className={styles.under_right_city_select} value={city} onChange={cities}>
                                <option>請選擇 縣/市</option>
                                <option value="臺北市">臺北市</option>
                                <option value="新北市">新北市</option>
                                <option value="桃園市">桃園市</option>
                                <option value="臺中市">臺中市</option>
                            </select>
                        </div>
                        <div className={styles.under_right_district}>
                            <div className={styles.under_right_district_text}>區</div>
                            <button type="button" className={city !== '' ? styles.under_right_district_cross : styles.under_right_district_invisible} onClick={deleted}>
                                <img src={cross} alt="cross" />
                            </button>
                            <div className={styles.under_right_district_arrow}>
                                <img src={arrow} alt="arrow" />
                            </div>
                            {city === '新北市' ? <select className={styles.under_right_district_select} value={district} onChange={districts}>
                                <option value="萬里區">萬里區</option>
                                <option value="金山區">金山區</option>
                                <option value="板橋區">板橋區</option>
                                <option value="汐止區">汐止區</option>
                                <option value="深坑區">深坑區</option>
                                <option value="石碇區">石碇區</option>
                                <option value="瑞芳區">瑞芳區</option>
                                <option value="三重區">三重區</option>
                                <option value="中和區">中和區</option>
                                <option value="永和區">永和區</option>
                                <option value="新莊區">新莊區</option>
                                <option value="新店區">新店區</option>
                                <option value="樹林區">樹林區</option>
                                <option value="鶯歌區">鶯歌區</option>
                                <option value="三峽區">三峽區</option>
                                <option value="淡水區">淡水區</option>
                                <option value="土城區">土城區</option>
                                <option value="蘆洲區">蘆洲區</option>
                                <option value="五股區">五股區</option>
                                <option value="泰山區">泰山區</option>
                                <option value="林口區">林口區</option>
                                <option value="坪林區">坪林區</option>
                                <option value="三芝區">三芝區</option>
                                <option value="石門區">石門區</option>
                                <option value="八里區">八里區</option>
                                <option value="平溪區">平溪區</option>
                                <option value="雙溪區">雙溪區</option>
                                <option value="貢寮區">貢寮區</option>
                                <option value="烏來區">烏來區</option>
                            </select> : ''}
                            {city === '臺北市' ? <select className={styles.under_right_district_select} value={district} onChange={districts}>
                                <option value="松山區">松山區</option>
                                <option value="信義區">信義區</option>
                                <option value="大安區">大安區</option>
                                <option value="中山區">中山區</option>
                                <option value="中正區">中正區</option>
                                <option value="大同區">大同區</option>
                                <option value="萬華區">萬華區</option>
                                <option value="文山區">文山區</option>
                                <option value="南港區">南港區</option>
                                <option value="內湖區">內湖區</option>
                                <option value="士林區">士林區</option>
                                <option value="北投區">北投區</option>
                            </select> : ''}

                            {city === '桃園市' ? <select className={styles.under_right_district_select} value={district} onChange={districts}>
                                <option value="桃園區">桃園區</option>
                                <option value="中壢區">中壢區</option>
                                <option value="大溪區">大溪區</option>
                                <option value="楊梅區">楊梅區</option>
                                <option value="蘆竹區">蘆竹區</option>
                                <option value="大園區">大園區</option>
                                <option value="龜山區">龜山區</option>
                                <option value="八德區">八德區</option>
                                <option value="龍潭區">龍潭區</option>
                                <option value="平鎮區">平鎮區</option>
                                <option value="新屋區">新屋區</option>
                                <option value="觀音區">觀音區</option>
                                <option value="復興區">復興區</option>
                            </select> : ''}
                            {city === '臺中市' ? <select className={styles.under_right_district_select} value={district} onChange={e => { setDistrict(e.target.value) }}>
                                <option value="中區">中區</option>
                                <option value="東區">東區</option>
                            </select> : ''}
                            {city === '' ? <select className={styles.under_right_district_select} value={district} onChange={e => { setDistrict(e.target.value); }}>
                                <option>請先選擇 縣/市</option>
                            </select> : ''}
                        </div>
                        <button className={submitted ? styles.under_right_submitted : styles.under_right_submit} type="button">SUBMIT</button>
                    </div>
                    <div className={styles.under_right_result}>
                        <div className={styles.under_right_result_white} />
                        <div className={styles.under_right_result_text}>搜尋結果</div>
                        <div className={styles.under_right_result_line} />
                    </div>
                    {loading ? <div className={styles.loader} >
                        <FadeLoader color={'#34eb8c'} loading={loading} size={100} />
                    </div> : <div>
                        <div className={styles.under_right_region}>
                            <span className={styles.under_right_region_number}>{year}</span>
                            <span className={styles.under_right_region_district}>年</span>
                            <span className={styles.under_right_region_district}>{city}</span>
                            <span className={styles.under_right_region_district}>{district}</span>
                        </div>
                        <div>
                            <div className={styles.under_right_hightcharts}>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={option1}
                                />
                            </div>
                            <div className={styles.under_right_hightcharts}>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={option2}
                                />
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div >
    );
}
export default Chart;
