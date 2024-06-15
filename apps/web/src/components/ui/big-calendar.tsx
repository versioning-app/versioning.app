'use client';
import { CalendarProps } from '@/components/ui/calendar';
import { DatePicker } from '@/components/ui/date-picker';
/* This example requires Tailwind CSS v2.0+ */
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from 'date-fns';
import { useState } from 'react';

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function BigCalendar({
  datePickerProps,
}: {
  datePickerProps?: CalendarProps;
}) {
  const today = startOfToday();
  const [currMonth, setCurrMonth] = useState(() => format(today, 'MMM-yyyy'));
  const [selectedDay, setSelectedDay] = useState<Date>();
  let firstDayOfMonth = parse(currMonth, 'MMM-yyyy', new Date());

  const isSelected = <DateType extends Date>(date: DateType): boolean => {
    if (!selectedDay) {
      return false;
    }

    return format(date, 'yyyy-MM-dd') === format(selectedDay, 'yyyy-MM-dd');
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth),
    end: endOfWeek(endOfMonth(firstDayOfMonth)),
  });

  const sameMonth = (day: Date) => {
    return currMonth === format(day, 'MMM-yyyy');
  };

  const updateDate = (date?: Date) => {
    if (date) {
      setCurrMonth(format(date, 'MMM-yyyy'));
      setSelectedDay(date);
    }
  };

  const getToday = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setCurrMonth(format(today, 'MMM-yyyy'));
  };

  const getPrevMonth = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 });
    setCurrMonth(format(firstDayOfPrevMonth, 'MMM-yyyy'));
  };

  const getNextMonth = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 });
    setCurrMonth(format(firstDayOfNextMonth, 'MMM-yyyy'));
  };

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <header className="relative z-20 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-4 lg:flex-none">
        {/* <h1 className="text-lg font-semibold text-muted-foreground"></h1> */}
        <div className="flex items-center">
          <DatePicker
            setDate={updateDate}
            date={selectedDay ?? today}
            month={parse(currMonth, 'MMM-yyyy', new Date())}
            onMonthChange={(date) => setCurrMonth(format(date, 'MMM-yyyy'))}
            {...datePickerProps}
          />

          <div className="hidden md:ml-4 md:flex md:items-center">
            {/* <Menu as="div" className="relative">
              <Menu.Button
                type="button"
                className="flex items-center rounded-md border border-gray-300 dark:border-gray-700 bg-card dark:bg-gray-900 py-2 pl-3 pr-2 text-sm font-medium text-foreground-text shadow-sm hover:bg-muted"
              >
                Month view
                <ChevronDownIcon
                  className="ml-2 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="focus:outline-none absolute right-0 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-card dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-muted text-muted-foreground hover:text-foreground'
                              : 'text-foreground-text',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Day view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-muted text-muted-foreground hover:text-foreground'
                              : 'text-foreground-text',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Week view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-muted text-muted-foreground hover:text-foreground'
                              : 'text-foreground-text',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Month view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-muted text-muted-foreground hover:text-foreground'
                              : 'text-foreground-text',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Year view
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu> */}
            {/* <div className="ml-6 h-6 w-px bg-gray-300" />
            <button
              type="button"
              className="focus:outline-none ml-6 rounded-md border border-transparent bg-primary select-none py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add event
            </button> */}
          </div>
          {/* <Menu as="div" className="relative ml-6 md:hidden">
            <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-card-foreground">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="focus:outline-none absolute right-0 mt-3 w-36 origin-top-right divide-y divide-muted overflow-hidden rounded-md bg-card dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? 'bg-muted text-muted-foreground hover:text-foreground'
                            : 'text-foreground-text',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Create event
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? 'bg-muted text-muted-foreground hover:text-foreground'
                            : 'text-foreground-text',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Go to today
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? 'bg-muted text-muted-foreground hover:text-foreground'
                            : 'text-foreground-text',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Day view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? 'bg-muted text-muted-foreground hover:text-foreground'
                            : 'text-foreground-text',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Week view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? 'bg-muted text-muted-foreground hover:text-foreground'
                            : 'text-foreground-text',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Month view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? 'bg-muted text-muted-foreground hover:text-foreground'
                            : 'text-foreground-text',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Year view
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu> */}
        </div>
      </header>
      <div className="shadow ring-1 ring-black dark:ring-gray-700 ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-700 text-center text-xs font-semibold leading-6 text-foreground-text lg:flex-none">
          <div className="bg-card dark:bg-gray-900 py-2">
            M<span className="sr-only sm:not-sr-only">on</span>
          </div>
          <div className="bg-card dark:bg-gray-900 py-2">
            T<span className="sr-only sm:not-sr-only">ue</span>
          </div>
          <div className="bg-card dark:bg-gray-900 py-2">
            W<span className="sr-only sm:not-sr-only">ed</span>
          </div>
          <div className="bg-card dark:bg-gray-900 py-2">
            T<span className="sr-only sm:not-sr-only">hu</span>
          </div>
          <div className="bg-card dark:bg-gray-900 py-2">
            F<span className="sr-only sm:not-sr-only">ri</span>
          </div>
          <div className="bg-card dark:bg-gray-900 py-2">
            S<span className="sr-only sm:not-sr-only">at</span>
          </div>
          <div className="bg-card dark:bg-gray-900 py-2">
            S<span className="sr-only sm:not-sr-only">un</span>
          </div>
        </div>
        <div className="flex bg-gray-200 dark:bg-gray-700 text-xs leading-6 text-foreground-text lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:gap-px">
            {daysInMonth.map((day, idx) => (
              <div
                key={idx}
                className={classNames(
                  currMonth === format(day, 'MMM-yyyy')
                    ? 'bg-card dark:bg-gray-900'
                    : 'bg-muted text-card-foreground',
                  (isSelected(day) || isToday(day)) && 'font-semibold',
                  !isSelected(day) && isToday(day) && 'text-primary',
                  'relative py-2 px-3 min-h-24'
                )}
                onClick={() => updateDate(day)}
              >
                <time
                  dateTime={getDate(day).toString()}
                  className={classNames(
                    isSelected(day) &&
                      'flex h-6 w-6 items-center justify-center rounded-full bg-primary select-none text-primary-foreground',
                    isSelected(day) && isToday(day) && 'bg-primary select-none',
                    isSelected(day) && isToday(day) && 'bg-primary select-none'
                  )}
                >
                  {getDate(day).toString()}
                </time>
                {/* {day.events.length > 0 && (
                  <ol className="mt-2">
                    {day.events.slice(0, 2).map((event) => (
                      <li key={event.id}>
                        <a href={event.href} className="group flex">
                          <p className="flex-auto truncate font-medium text-muted-foreground group-hover:text-primary">
                            {event.name}
                          </p>
                          <time
                            dateTime={event.datetime}
                            className="ml-3 hidden flex-none text-card-foreground group-hover:text-primary xl:block"
                          >
                            {event.time}
                          </time>
                        </a>
                      </li>
                    ))}
                    {day.events.length > 2 && (
                      <li className="text-card-foreground">
                        + {day.events.length - 2} more
                      </li>
                    )}
                  </ol>
                )} */}
              </div>
            ))}
          </div>
          <div className="isolate grid w-full grid-cols-7 gap-px lg:hidden">
            {daysInMonth.map((day, ixd) => (
              <button
                key={ixd}
                type="button"
                className={classNames(
                  sameMonth(day) ? 'bg-card dark:bg-gray-900' : 'bg-muted',
                  (isSelected(day) || isToday(day)) && 'font-semibold',
                  isSelected(day) && 'text-white',
                  !isSelected(day) && isToday(day) && 'text-primary',
                  !isSelected(day) &&
                    sameMonth(day) &&
                    !isToday(day) &&
                    'text-muted-foreground dark:text-card-foreground',
                  !isSelected(day) &&
                    !sameMonth(day) &&
                    !isToday(day) &&
                    'text-muted-foreground',
                  'flex h-14 flex-col py-2 px-3 hover:bg-card/80 hover:dark:bg-gray-900/80 focus:z-10 min-h-24'
                )}
                onClick={() => updateDate(day)}
              >
                <time
                  dateTime={getDate(day).toString()}
                  className={classNames(
                    isSelected(day) &&
                      'flex h-6 w-6 items-center justify-center rounded-full bg-primary select-none',
                    isSelected(day) && isToday(day) && 'bg-primary select-none',
                    'ml-auto'
                  )}
                >
                  {getDate(day).toString()}
                </time>
                {/* <p className="sr-only">{day.events.length} events</p> */}
                {/* {day.events.length > 0 && (
                  <div className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    {day.events.map((event) => (
                      <div
                        key={event.id}
                        className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"
                      />
                    ))}
                  </div>
                )} */}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* {selectedDay && selectedDay?.events.length > 0 && (
        <div className="py-10 px-4 sm:px-6 lg:hidden">
          <ol className="divide-y divide-muted overflow-hidden rounded-lg bg-card dark:bg-gray-900 text-sm shadow ring-1 ring-black ring-opacity-5">
            {selectedDay.events.map((event) => (
              <li
                key={event.id}
                className="group flex p-4 pr-6 focus-within:bg-muted hover:bg-muted"
              >
                <div className="flex-auto">
                  <p className="font-semibold text-muted-foreground">
                    {event.name}
                  </p>
                  <time
                    dateTime={event.datetime}
                    className="mt-2 flex items-center text-foreground-text"
                  >
                    <ClockIcon
                      className="mr-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    {event.time}
                  </time>
                </div>
                <a
                  href={event.href}
                  className="ml-6 flex-none self-center rounded-md border border-gray-300 dark:border-gray-700 bg-card dark:bg-gray-900 py-2 px-3 font-semibold text-foreground-text opacity-0 shadow-sm hover:bg-muted focus:opacity-100 group-hover:opacity-100"
                >
                  Edit<span className="sr-only">, {event.name}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )} */}
    </div>
  );
}
