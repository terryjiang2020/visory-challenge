import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import { getEventListFull } from '../components/Services/shared';
import { Filter, TMEvent, TMPage } from '../components/Services/types';
// import { Navigation, Pagination, Autoplay } from 'swiper';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
import { supportedCountryCodes } from '../components/Services/ticketmaster';
import LoaderFullScreen from '../components/LoaderFullScreen';

const Index = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Sales Admin'));
    });

    const [loading, setLoading] = useState(false);

    const [filter, setFilter] = useState<Filter>({
        countryCode: '',
        stateCode: '', // There's no existing API from Ticketmaster that can fetch the list of available state code for a countr
        city: '' // There's no existing API from Ticketmaster that can fetch the list of available city for a state
    });

    const [eventList, setEventList] = useState<TMEvent[]>([]);

    const defaultPage = {
        size: 20,
        totalElements: 0,
        totalPages: 0,
        number: 0
    }

    const [page, setPage] = useState<TMPage>(defaultPage);

    function expandText(index: number) {
        const newEventList = [...eventList];
        newEventList[index].textExpanded = !newEventList[index].textExpanded;
        newEventList[index].textExpandable = true;
        setEventList(newEventList);
        setTimeout(() => {
            console.log(document.getElementById("info-" + index)!.scrollHeight, document.getElementById("info-" + index)!.clientHeight)
        }, 100);
    }

    useEffect(() => {
        console.log('filter fired');
        // reset page number
        setPage({...defaultPage, number: -1});
    }, [filter]);

    useEffect(() => {
        console.log('page fired');
        if (page.number >= 0) {
            setLoading(true);
            getEventListFull(filter, page.number).then((res) => {
                console.log('res: ', res);
                if (res._embedded && res._embedded.events) {
                    setEventList(res._embedded.events);
                }
                else {
                    setEventList([]);
                }
                if (res.page) {
                    // Ticketmaster API only allows up to 1000 results in total
                    // 50 (page number) * 20 (page size) = 1000, hence 50 would be the maximum page number allowed here
                    res.page.totalPages = Math.min(res.page.totalPages, 50);
                    setPage(res.page);
                }
                else {
                    setPage(defaultPage);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('getEventListFull failed, error: ', err);
                setLoading(false);
            })
        }
        else {
            setPage(defaultPage);
        }
    }, [page.number]);
    // }, []);

    useEffect(() => {
        console.log('eventList: ', eventList);
    }, [eventList])

    useEffect(() => {
        console.log('page: ', page);
    }, [page])

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber < page.totalPages && pageNumber >= 0) {
            setPage({
                ...page,
                number: pageNumber
            });
        }
    }

    const eventEle = (event: TMEvent, index: number) => (
        <div className="panel h-full">
            <div className="flex items-center justify-between dark:text-white-light mb-5">
                <h5 className="font-semibold text-lg overflow-hidden line-clamp-1">{event.name}</h5>
            </div>
            {/* Turns out the images of an event are just the same image in different size and ratio, no need for swiper */}
            {/* <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                navigation={{ nextEl: '.swiper-button-next-ex2', prevEl: '.swiper-button-prev-ex2' }}
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{ delay: 2000 }}
                className="swiper max-w-3xl mx-auto mb-5"
                id="slider2"
                dir={themeConfig.rtlClass}
                key={themeConfig.rtlClass === 'rtl' ? 'true' : 'false'}
            >
                <div className="swiper-wrapper">
                    {event.images.map((item, i) => {
                        return (
                            <SwiperSlide key={i}>
                                <img src={item.url} className="w-full max-h-80 object-cover" alt="itemImage" />
                            </SwiperSlide>
                        );
                    })}
                </div>
                <button className="swiper-button-prev-ex2 grid place-content-center ltr:left-2 rtl:right-2 p-1 transition text-primary hover:text-white border border-primary  hover:border-primary hover:bg-primary rounded-full absolute z-[999] top-1/2 -translate-y-1/2">
                    <IconCaretDown className="w-5 h-5 rtl:-rotate-90 rotate-90" />
                </button>
                <button className="swiper-button-next-ex2 grid place-content-center ltr:right-2 rtl:left-2 p-1 transition text-primary hover:text-white border border-primary  hover:border-primary hover:bg-primary rounded-full absolute z-[999] top-1/2 -translate-y-1/2">
                    <IconCaretDown className="w-5 h-5 rtl:rotate-90 -rotate-90" />
                </button>
            </Swiper> */}
            <img srcSet={
                event.images.filter(i => i.ratio == '16_9')
                .map(image => image.url + ' ' + image.width + 'w')
                .join(', ')
            } className="w-full max-h-80 object-cover mb-9" alt="itemImage" />
            <div className="space-y-9">
                <div className="flex items-center">
                    <div className="flex-1">
                        <div className="flex font-semibold text-white-dark mb-2">
                            <h6>Start Date and Time</h6>
                        </div>
                        <div>
                            <p className="ltr:ml-auto rtl:mr-auto">{
                                new Date(event.dates.start.dateTime).toLocaleString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                })
                            } (in your local time)</p>
                        </div>
                    </div>
                    {
                        event.dates.end && (
                        <div className="flex-1">
                            <div className="flex font-semibold text-white-dark mb-2">
                                <h6>End Date and Time</h6>
                            </div>
                            <div>
                                <p className="ltr:ml-auto rtl:mr-auto">{
                                    new Date(event.dates.start.dateTime).toLocaleString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                    })
                                } (in your local time)</p>
                            </div>
                        </div>
                        )
                    }
                </div>
                <div className="flex items-center">
                    <div className="flex-1">
                        <div className="flex font-semibold text-white-dark mb-2">
                            <h6>Information</h6>
                        </div>
                        <div>
                            <p className={
                                "ltr:ml-auto rtl:mr-auto" +
                                (!event.textExpanded ? ' line-clamp-1' : '')
                            } id={"info-" + index}>
                                {event.info ? event.info : 'No information provided.'}
                                &nbsp;
                            </p>
                            {
                                (
                                    event.info && event.info.length > 0 &&
                                    (
                                        event.textExpanded ||
                                        (
                                            document.getElementById("info-" + index) &&
                                            document.getElementById("info-" + index)!.scrollHeight !== document.getElementById("info-" + index)!.clientHeight
                                        ) ||
                                        event.textExpandable
                                    )
                                ) ? (
                                    <a onClick={() => expandText(index)}
                                    className='underline hover:no-underline cursor-pointer'>{
                                        event.textExpanded ? 'Hide ' : 'Expand '
                                    } Text</a>
                                )
                                :
                                null
                            }
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="flex-1">
                        <p className="ltr:ml-auto rtl:mr-auto underline hover:no-underline">
                            <Link to={event.url} target="_blank">View on Ticketmaster</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )

    const paginatorCommon = "flex justify-center font-semibold px-3.5 py-2 rounded transition border-2";

    const paginatorActive = " text-primary border-primary dark:border-primary dark:text-white-light";

    const paginatorInactive = " text-dark hover:text-primary border-white-light dark:border-[#191e3a] hover:border-primary dark:hover:border-primary dark:text-white-light";

    const paginator = () => (
        <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse m-auto mb-4">
            {
                page.number !== 0 && (
                    <>
                        <li>
                            <button
                                type="button"
                                className={paginatorCommon + paginatorInactive}
                                onClick={() => {
                                    handlePageChange(0)
                                }}
                            >
                                First
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className={paginatorCommon + paginatorInactive}
                                onClick={() => {
                                    handlePageChange(page.number - 1)
                                }}
                            >
                                Prev
                            </button>
                        </li>
                    </>
                )
            }
            {
                page.number == 0
                ?
                // When user is on the first page
                <>
                    <li>
                        <button
                            type="button"
                            className={paginatorCommon + paginatorActive}
                        >
                            {
                                page.number + 1
                            }
                        </button>
                    </li>
                    {
                        page.totalPages > page.number + 1 &&
                        <li>
                            <button
                                type="button"
                                className={paginatorCommon + paginatorInactive}
                                onClick={() => {
                                    handlePageChange(page.number + 1)
                                }}
                            >
                                {
                                    page.number + 2
                                }
                            </button>
                        </li>
                    }
                    {
                        page.totalPages > page.number + 2 &&
                        <li>
                            <button
                                type="button"
                                className={paginatorCommon + paginatorInactive}
                                onClick={() => {
                                    handlePageChange(page.number + 2)
                                }}
                            >
                                {
                                    page.number + 3
                                }
                            </button>
                        </li>
                    }
                </>
                :
                page.number == page.totalPages - 1
                ?
                // When user is on the last page
                <>
                    {
                        page.number - 2 >= 0 &&
                        <li>
                            <button
                                type="button"
                                className={paginatorCommon + paginatorInactive}
                                onClick={() => {
                                    handlePageChange(page.number - 2)
                                }}
                            >
                                {
                                    page.number - 1
                                }
                            </button>
                        </li>
                    }
                    {
                        page.number - 1 >= 0 &&
                        <li>
                            <button
                                type="button"
                                className={paginatorCommon + paginatorInactive}
                                onClick={() => {
                                    handlePageChange(page.number - 1)
                                }}
                            >
                                {
                                    page.number
                                }
                            </button>
                        </li>
                    }
                    <li>
                        <button
                            type="button"
                            className={paginatorCommon + paginatorActive}
                        >
                            {
                                page.number + 1
                            }
                        </button>
                    </li>
                </>
                :
                // Otherwise, user is on the middle page
                // Which means there must be at least 3 pages
                <>
                    <li>
                        <button
                            type="button"
                            className={paginatorCommon + paginatorInactive}
                            onClick={() => {
                                handlePageChange(page.number - 1)
                            }}
                        >
                            {
                                page.number
                            }
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className={paginatorCommon + paginatorActive}
                        >
                            {
                                page.number + 1
                            }
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className={paginatorCommon + paginatorInactive}
                            onClick={() => {
                                handlePageChange(page.number + 1)
                            }}
                        >
                            {
                                page.number + 2
                            }
                        </button>
                    </li>
                </>
            }
            {
                page.totalPages > page.number + 1 && (
                    <>
                        <li>
                            <button
                                type="button"
                                className={paginatorCommon + paginatorInactive}
                                onClick={() => {
                                    handlePageChange(page.number + 1)
                                }}
                            >
                                Next
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className={paginatorCommon + paginatorInactive}
                                onClick={() => {
                                    handlePageChange(page.totalPages - 1)
                                }}
                            >
                                Last
                            </button>
                        </li>
                    </>
                )
            }
        </ul>
    )

    return (
        <div>
            {
                loading && <LoaderFullScreen />
            }

            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Events</span>
                </li>
            </ul>

            <div className="pt-5">
                
            <div className="p-4 mb-5 border-b border-[#ebedf2] dark:border-[#253b5c] grid grid-rows-1 sm:grid-cols-4 gap-4">
                <div>
                    <div className="font-semibold mb-1.5">Country</div>
                        <select className="form-select text-white-dark"
                        onChange={(e) => setFilter({
                            ...filter,
                            countryCode: e.target.value
                        })}>
                            {
                                supportedCountryCodes.map((item) => {
                                    return (
                                        <option key={item.countryCode} value={item.countryCode}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
                { eventList.length ?
                    <div className="grid sm:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-6 mb-6">
                        {
                            eventList.map((event, index) => 
                                <div key={event.id}>
                                    {eventEle(event, index)}
                                </div>
                            )
                        }
                    </div>
                    :
                    <p className='text-center w-full mb-6'>No events found.</p>
                }
                <div className="flex justify-center">
                    {
                        paginator()
                    }
                </div>
            </div>
        </div>

    );
};

export default Index;
